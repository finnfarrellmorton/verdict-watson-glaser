import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-ink placeholder:text-muted focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/20",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
