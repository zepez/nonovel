"use client";

import { signOut } from "next-auth/react";
import { cn } from "~/lib";

interface LogoutProps {
  className?: string;
  children: React.ReactNode | ((cb: () => void) => React.ReactNode);
}

export function Logout({ className, children }: LogoutProps) {
  const cb = async () => {
    await signOut();
  };

  return typeof children === "function" ? (
    children(cb)
  ) : (
    <button
      onClick={cb}
      className={cn("nn-interactive", className)}
      title="Logout"
    >
      {children}
    </button>
  );
}
