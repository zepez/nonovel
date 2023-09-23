import * as React from "react";

import { cn } from "~/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "placeholder:text-nn-dark/60 dark:placeholder:text-nn-light/60 nn-border-50 flex h-9 w-full rounded-md border bg-inherit px-3 py-1 text-sm transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
