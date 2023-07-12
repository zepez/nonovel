"use client";

import * as React from "react";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

export function AuthProvider({ children }: SessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
