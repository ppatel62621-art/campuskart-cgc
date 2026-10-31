import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        id={inputId}
        className={cn(
          "h-11 w-full rounded-2xl border border-stone-300 bg-white px-3 text-sm text-ink outline-none transition placeholder:text-stone-400 focus:border-campus-600 focus:ring-2 focus:ring-campus-100",
          className,
        )}
        {...props}
      />
    </label>
  );
}
