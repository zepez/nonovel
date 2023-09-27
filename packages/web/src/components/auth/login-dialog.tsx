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
        <DialogHeader>
          <DialogTitle className="pb-2 font-serif text-2xl">
            Login or Register
          </DialogTitle>
          <DialogDescription className="pb-3">
            <p className="text-base">
              Please select your preferred social authentication service below
              to sign in or sign up.
            </p>
            <p className="pt-3 text-xs opacity-80">
              Remember, to keep your account secure and avoid any complications,
              always use the same service that you originally signed up with.
            </p>
          </DialogDescription>
        </DialogHeader>
        <Login />
      </DialogContent>
    </Dialog>
  );
}
