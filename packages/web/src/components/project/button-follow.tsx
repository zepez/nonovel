"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "~/lib/utils";
import { follow } from "~/actions";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

interface ButtonFollowProps {
  className?: string;
  followId?: string;
  userId?: string;
  projectId: string;
  projectName: string;
}

export const ButtonFollow = ({
  className,
  followId,
  userId,
  projectId,
  projectName,
}: ButtonFollowProps) => {
  const [text, setText] = useState(
    !userId ? "LOGIN TO FOLLOW" : followId ? "UNFOLLOW" : "FOLLOW"
  );
  const { toast } = useToast();
  const router = useRouter();

  const toggleFollow = async () => {
    if (!userId) return router.push("/api/auth/signin");

    setText("...");

    const action = followId ? "delete" : "create";

    const [error] = await follow({ userId, projectId, action });

    if (error) {
      console.error(error);
      setText("Error");
      toast({
        description: followId
          ? "Unable to unfollow project. Please try again later."
          : "Unable to follow project. Please try again later.",
      });
    }

    if (!error) {
      setText(followId ? "FOLLOW" : "UNFOLLOW");
      toast({
        description: followId
          ? `You have stopped following ${projectName}.`
          : `You are now following ${projectName}.`,
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="fluid"
      disabled={text === "..." || text === "Error"}
      className={cn(
        className,
        "bg-zinc-950/40 px-4 py-2 text-center text-sm font-semibold leading-tight text-white"
      )}
      onClick={() => toggleFollow()}
    >
      {text}
    </Button>
  );
};
