"use client";

import { signIn } from "next-auth/react";
import { BsDiscord, BsGithub, BsGoogle } from "react-icons/bs";
import { Button } from "~/components/ui/button";

interface LoginButtonProps {
  Icon: typeof BsDiscord;
  provider: string;
  title: string;
}

const LoginButton = ({ Icon, provider, title }: LoginButtonProps) => {
  return (
    <Button
      variant="secondary"
      size="fluid"
      onClick={() => signIn(provider)}
      className="flex-basis-0 flex flex-grow flex-col gap-2 py-3 text-xs uppercase"
      title={`Login with ${title}`}
    >
      <Icon className="h-6 w-6" />
      <span>{title}</span>
    </Button>
  );
};

export function Login() {
  return (
    <div className="flex justify-evenly gap-4">
      <LoginButton Icon={BsGoogle} provider="google" title="Google" />
      <LoginButton Icon={BsDiscord} provider="discord" title="Discord" />
      <LoginButton Icon={BsGithub} provider="github" title="Github" />
    </div>
  );
}
