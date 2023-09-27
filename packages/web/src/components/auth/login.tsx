"use client";

import { signIn } from "next-auth/react";
import { BsDiscord, BsGithub } from "react-icons/bs";
import { Button } from "~/components/ui/button";

export function Login() {
  return (
    <div className="flex justify-evenly gap-4">
      <Button
        variant="contrast"
        size="fluid"
        onClick={() => signIn("discord")}
        className="flex-basis-0 flex flex-grow gap-3 uppercase"
        title="Login with Discord"
      >
        <BsDiscord className="h-6 w-6" /> Discord
      </Button>
      <Button
        variant="contrast"
        size="fluid"
        onClick={() => signIn("github")}
        className="flex-basis-0 flex flex-grow gap-3 uppercase"
        title="Login with Github"
      >
        <BsGithub className="h-6 w-6" /> Github
      </Button>
    </div>
  );
}
