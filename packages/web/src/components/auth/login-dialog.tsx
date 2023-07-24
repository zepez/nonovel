"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Login } from "./login";

interface LoginDialogProps {
  children: React.ReactNode | ((cb: () => void) => React.ReactNode);
}

export function LoginDialog({ children }: LoginDialogProps) {
  const [open, setOpen] = useState(false);

  const cb = () => setOpen((v) => !v);

  return (
    <Dialog open={open} onOpenChange={cb}>
      <DialogTrigger asChild className="">
        {typeof children === "function" ? children(cb) : children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>Login or Register</DialogTitle>
          <DialogDescription>
            Please select your preferred service for logging in or registering.
            <br />
            <br />
            Remember, to keep your account secure and avoid any complications,
            always use the same service that you originally signed up with.
          </DialogDescription>
        </DialogHeader>
        <Login />
      </DialogContent>
    </Dialog>
  );
}
