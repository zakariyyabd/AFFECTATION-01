import { SelectHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
