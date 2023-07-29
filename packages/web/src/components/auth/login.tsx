"use client";

import { signIn } from "next-auth/react";
import { BsDiscord, BsGithub } from "react-icons/bs";
import { Button } from "~/components/ui/button";

export function Login() {
  return (
    <>
      <Button
        variant="contrast"
        size="fluid"
        onClick={() => signIn("discord")}
        className="flex gap-3"
        title="Login with Discord"
      >
        <BsDiscord className="w-6 h-6" /> Sign in with Discord
      </Button>
      <Button
        variant="contrast"
        size="fluid"
        onClick={() => signIn("github")}
        className="flex gap-3"
        title="Login with Github"
      >
        <BsGithub className="w-6 h-6" /> Sign in with Github
      </Button>
    </>
  );
}
