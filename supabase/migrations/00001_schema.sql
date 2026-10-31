-- CampusKart schema
-- First campus: CGC University, Mohali
-- Paste this file into the Supabase SQL Editor and run it on a fresh project.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('student', 'vendor', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'vendor_status') then
    create type public.vendor_status as enum ('pending', 'approved', 'suspended');
  end if;
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type public.order_status as enum (
      'placed',
      'accepted',
      'preparing',
      'ready',
      'delivered',
      'cancelled'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type public.payment_status as enum ('unpaid', 'cod', 'paid', 'refunded');
  end if;
  if not exists (select 1 from pg_type where typname = 'notification_type') then
    create type public.notification_type as enum ('order', 'review', 'system', 'vendor');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Helper: updated_at
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- campuses (supporting table for the first CGC Mohali campus)
-- ---------------------------------------------------------------------------

create table if not exists public.campuses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  slug text not null unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists campuses_set_updated_at on public.campuses;
create trigger campuses_set_updated_at
before update on public.campuses
for each row execute function public.set_updated_at();

insert into public.campuses (name, city, slug)
values ('CGC University', 'Mohali', 'cgc-university-mohali')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- 1. profiles
-- One row per Supabase auth user. Role drives RLS.
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role public.user_role not null default 'student',
  campus_id uuid references public.campuses (id) on delete set null,
  hostel_block text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_phone_length check (phone is null or char_length(phone) between 8 and 20)
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_campus_id_idx on public.profiles (campus_id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- New auth users always start as students. Admin/vendor roles are assigned later.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_campus uuid;
begin
  select id into default_campus
  from public.campuses
  where slug = 'cgc-university-mohali'
  limit 1;

  insert into public.profiles (id, full_name, role, campus_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'student',
    default_campus
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. vendors
-- ---------------------------------------------------------------------------

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete restrict,
  campus_id uuid not null references public.campuses (id) on delete restrict,
  name text not null,
  slug text not null unique,
  category text not null,
  description text,
  address text,
  phone text,
  is_open boolean not null default true,
  status public.vendor_status not null default 'pending',
  rating numeric(2, 1) not null default 0,
  eta_minutes integer not null default 25,
  image_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint vendors_name_not_blank check (char_length(btrim(name)) >= 2),
  constraint vendors_category_check check (
    category in ('kirana', 'printing', 'thrift', 'mithai', 'gifts', 'services')
  ),
  constraint vendors_rating_range check (rating >= 0 and rating <= 5),
  constraint vendors_eta_positive check (eta_minutes > 0)
);

create index if not exists vendors_owner_id_idx on public.vendors (owner_id);
create index if not exists vendors_campus_id_idx on public.vendors (campus_id);
create index if not exists vendors_category_idx on public.vendors (category);
create index if not exists vendors_status_idx on public.vendors (status);

drop trigger if exists vendors_set_updated_at on public.vendors;
create trigger vendors_set_updated_at
before update on public.vendors
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. products
-- ---------------------------------------------------------------------------

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors (id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  image_url text,
  sku text,
  in_stock boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint products_name_not_blank check (char_length(btrim(name)) >= 2),
  constraint products_price_positive check (price >= 0),
  constraint products_vendor_sku_unique unique (vendor_id, sku)
);

create index if not exists products_vendor_id_idx on public.products (vendor_id);
create index if not exists products_in_stock_idx on public.products (vendor_id, in_stock);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. services
-- ---------------------------------------------------------------------------

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors (id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  duration_minutes integer,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint services_name_not_blank check (char_length(btrim(name)) >= 2),
  constraint services_price_positive check (price >= 0),
  constraint services_duration_positive check (duration_minutes is null or duration_minutes > 0)
);

create index if not exists services_vendor_id_idx on public.services (vendor_id);
create index if not exists services_active_idx on public.services (vendor_id, is_active);

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 7. delivery_slots  (created before orders so orders can reference it)
-- ---------------------------------------------------------------------------

create table if not exists public.delivery_slots (
  id uuid primary key default gen_random_uuid(),
  campus_id uuid not null references public.campuses (id) on delete cascade,
  label text not null,
  starts_at time not null,
  ends_at time not null,
  cutoff_at time,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint delivery_slots_time_order check (ends_at > starts_at),
  constraint delivery_slots_campus_window unique (campus_id, starts_at, ends_at)
);

create index if not exists delivery_slots_campus_id_idx on public.delivery_slots (campus_id, is_active);

drop trigger if exists delivery_slots_set_updated_at on public.delivery_slots;
create trigger delivery_slots_set_updated_at
before update on public.delivery_slots
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 5. orders
-- ---------------------------------------------------------------------------

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete restrict,
  vendor_id uuid references public.vendors (id) on delete restrict,
  delivery_slot_id uuid references public.delivery_slots (id) on delete set null,
  campus_id uuid references public.campuses (id) on delete set null,
  status public.order_status not null default 'placed',
  payment_status public.payment_status not null default 'unpaid',
  total numeric(10, 2) not null default 0,
  delivery_address text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint orders_total_nonnegative check (total >= 0)
);

create index if not exists orders_student_id_idx on public.orders (student_id);
create index if not exists orders_vendor_id_idx on public.orders (vendor_id);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 6. order_items
-- Exactly one of product_id or service_id must be set.
-- ---------------------------------------------------------------------------

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete restrict,
  service_id uuid references public.services (id) on delete restrict,
  title text not null,
  quantity integer not null default 1,
  unit_price numeric(10, 2) not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint order_items_quantity_positive check (quantity > 0),
  constraint order_items_unit_price_nonnegative check (unit_price >= 0),
  constraint order_items_product_or_service check (
    (product_id is not null and service_id is null)
    or (product_id is null and service_id is not null)
  )
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists order_items_product_id_idx on public.order_items (product_id);
create index if not exists order_items_service_id_idx on public.order_items (service_id);

-- ---------------------------------------------------------------------------
-- 8. reviews
-- ---------------------------------------------------------------------------

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  vendor_id uuid not null references public.vendors (id) on delete cascade,
  order_id uuid references public.orders (id) on delete set null,
  rating integer not null,
  comment text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint reviews_rating_range check (rating between 1 and 5),
  constraint reviews_one_per_student_vendor unique (student_id, vendor_id)
);

create index if not exists reviews_vendor_id_idx on public.reviews (vendor_id);
create index if not exists reviews_student_id_idx on public.reviews (student_id);

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
before update on public.reviews
for each row execute function public.set_updated_at();

create or replace function public.refresh_vendor_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_vendor uuid;
begin
  target_vendor := coalesce(new.vendor_id, old.vendor_id);

  update public.vendors v
  set rating = coalesce((
    select round(avg(r.rating)::numeric, 1)
    from public.reviews r
    where r.vendor_id = target_vendor
  ), 0)
  where v.id = target_vendor;

  return coalesce(new, old);
end;
$$;

drop trigger if exists reviews_refresh_vendor_rating on public.reviews;
create trigger reviews_refresh_vendor_rating
after insert or update or delete on public.reviews
for each row execute function public.refresh_vendor_rating();

-- ---------------------------------------------------------------------------
-- 9. notifications
-- ---------------------------------------------------------------------------

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type public.notification_type not null default 'system',
  title text not null,
  body text,
  data jsonb not null default '{}'::jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists notifications_user_id_idx on public.notifications (user_id, is_read, created_at desc);

-- ---------------------------------------------------------------------------
-- Role helpers used by RLS (security definer so they do not recurse)
-- ---------------------------------------------------------------------------

create or replace function public.current_profile_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() = 'admin', false);
$$;

create or replace function public.is_vendor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() = 'vendor', false);
$$;

create or replace function public.owns_vendor(p_vendor_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.vendors
    where id = p_vendor_id
      and owner_id = auth.uid()
  );
$$;

create or replace function public.can_read_order(p_order_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.orders o
    where o.id = p_order_id
      and (
        o.student_id = auth.uid()
        or public.is_admin()
        or (o.vendor_id is not null and public.owns_vendor(o.vendor_id))
      )
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.campuses enable row level security;
alter table public.profiles enable row level security;
alter table public.vendors enable row level security;
alter table public.products enable row level security;
alter table public.services enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.delivery_slots enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;

-- campuses
drop policy if exists campuses_select on public.campuses;
create policy campuses_select on public.campuses
  for select using (true);

drop policy if exists campuses_admin_write on public.campuses;
create policy campuses_admin_write on public.campuses
  for all using (public.is_admin()) with check (public.is_admin());

-- profiles
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = public.current_profile_role());

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- vendors
drop policy if exists vendors_select on public.vendors;
create policy vendors_select on public.vendors
  for select using (
    status = 'approved'
    or owner_id = auth.uid()
    or public.is_admin()
  );

drop policy if exists vendors_insert_owner on public.vendors;
create policy vendors_insert_owner on public.vendors
  for insert with check (
    owner_id = auth.uid()
    and (public.is_vendor() or public.is_admin())
  );

drop policy if exists vendors_update_owner on public.vendors;
create policy vendors_update_owner on public.vendors
  for update using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists vendors_delete_admin on public.vendors;
create policy vendors_delete_admin on public.vendors
  for delete using (public.is_admin());

-- products
drop policy if exists products_select on public.products;
create policy products_select on public.products
  for select using (
    exists (
      select 1 from public.vendors v
      where v.id = products.vendor_id
        and (v.status = 'approved' or v.owner_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists products_write_owner on public.products;
create policy products_write_owner on public.products
  for all using (
    public.is_admin() or public.owns_vendor(vendor_id)
  ) with check (
    public.is_admin() or public.owns_vendor(vendor_id)
  );

-- services
drop policy if exists services_select on public.services;
create policy services_select on public.services
  for select using (
    exists (
      select 1 from public.vendors v
      where v.id = services.vendor_id
        and (v.status = 'approved' or v.owner_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists services_write_owner on public.services;
create policy services_write_owner on public.services
  for all using (
    public.is_admin() or public.owns_vendor(vendor_id)
  ) with check (
    public.is_admin() or public.owns_vendor(vendor_id)
  );

-- delivery_slots
drop policy if exists delivery_slots_select on public.delivery_slots;
create policy delivery_slots_select on public.delivery_slots
  for select using (true);

drop policy if exists delivery_slots_admin_write on public.delivery_slots;
create policy delivery_slots_admin_write on public.delivery_slots
  for all using (public.is_admin()) with check (public.is_admin());

-- orders
drop policy if exists orders_select on public.orders;
create policy orders_select on public.orders
  for select using (
    student_id = auth.uid()
    or public.is_admin()
    or (vendor_id is not null and public.owns_vendor(vendor_id))
  );

drop policy if exists orders_insert_student on public.orders;
create policy orders_insert_student on public.orders
  for insert with check (
    student_id = auth.uid()
    and coalesce(public.current_profile_role(), 'student') in ('student', 'admin')
  );

drop policy if exists orders_update_parties on public.orders;
create policy orders_update_parties on public.orders
  for update using (
    public.is_admin()
    or (vendor_id is not null and public.owns_vendor(vendor_id))
    or student_id = auth.uid()
  ) with check (
    public.is_admin()
    or (vendor_id is not null and public.owns_vendor(vendor_id))
    or student_id = auth.uid()
  );

drop policy if exists orders_delete_admin on public.orders;
create policy orders_delete_admin on public.orders
  for delete using (public.is_admin());

-- order_items
drop policy if exists order_items_select on public.order_items;
create policy order_items_select on public.order_items
  for select using (public.can_read_order(order_id));

drop policy if exists order_items_insert on public.order_items;
create policy order_items_insert on public.order_items
  for insert with check (
    public.can_read_order(order_id)
    and exists (
      select 1 from public.orders o
      where o.id = order_id
        and o.student_id = auth.uid()
    )
  );

drop policy if exists order_items_update on public.order_items;
create policy order_items_update on public.order_items
  for update using (public.can_read_order(order_id))
  with check (public.can_read_order(order_id));

drop policy if exists order_items_delete on public.order_items;
create policy order_items_delete on public.order_items
  for delete using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.student_id = auth.uid()
        and o.status = 'placed'
    )
  );

-- reviews
drop policy if exists reviews_select on public.reviews;
create policy reviews_select on public.reviews
  for select using (true);

drop policy if exists reviews_insert_student on public.reviews;
create policy reviews_insert_student on public.reviews
  for insert with check (student_id = auth.uid());

drop policy if exists reviews_update_own on public.reviews;
create policy reviews_update_own on public.reviews
  for update using (student_id = auth.uid() or public.is_admin())
  with check (student_id = auth.uid() or public.is_admin());

drop policy if exists reviews_delete on public.reviews;
create policy reviews_delete on public.reviews
  for delete using (student_id = auth.uid() or public.is_admin());

-- notifications
drop policy if exists notifications_select_own on public.notifications;
create policy notifications_select_own on public.notifications
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own on public.notifications
  for update using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists notifications_insert_admin on public.notifications;
create policy notifications_insert_admin on public.notifications
  for insert with check (public.is_admin() or user_id = auth.uid());

drop policy if exists notifications_delete on public.notifications;
create policy notifications_delete on public.notifications
  for delete using (user_id = auth.uid() or public.is_admin());

-- Storage bucket for vendor photos (used later by the app)
insert into storage.buckets (id, name, public)
values ('vendor-assets', 'vendor-assets', true)
on conflict (id) do nothing;
