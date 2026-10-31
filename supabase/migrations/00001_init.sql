-- CampusKart initial schema for CGC University, Mohali.
-- Run this in the Supabase SQL editor or via the Supabase CLI.

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('student', 'vendor', 'admin');
  end if;
end $$;

create table if not exists public.campuses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role public.user_role not null default 'student',
  campus_id uuid references public.campuses (id),
  created_at timestamptz not null default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  campus_id uuid not null references public.campuses (id) on delete cascade,
  owner_id uuid references public.profiles (id),
  name text not null,
  slug text unique not null,
  category text not null,
  description text,
  address text,
  phone text,
  is_open boolean not null default true,
  rating numeric(2, 1) not null default 4.5,
  eta_minutes integer not null default 25,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors (id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  image_url text,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id),
  vendor_id uuid not null references public.vendors (id),
  status text not null default 'placed',
  fulfillment_notes text,
  total numeric(10, 2) not null default 0,
  payment_status text not null default 'unpaid',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id),
  quantity integer not null default 1,
  unit_price numeric(10, 2) not null
);

alter table public.campuses enable row level security;
alter table public.profiles enable row level security;
alter table public.vendors enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "campuses are readable" on public.campuses
  for select using (true);

create policy "vendors are readable" on public.vendors
  for select using (true);

create policy "products are readable" on public.products
  for select using (true);

create policy "users can read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "students can read own orders" on public.orders
  for select using (auth.uid() = student_id);

create policy "students can create own orders" on public.orders
  for insert with check (auth.uid() = student_id);

create policy "order items follow parent order" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.student_id = auth.uid()
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'student')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.campuses (name, city, slug)
values ('CGC University', 'Mohali', 'cgc-university-mohali')
on conflict (slug) do nothing;
