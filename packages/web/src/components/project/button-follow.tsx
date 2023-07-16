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
    !userId ? "SIGN IN TO BOOKMARK" : followId ? "REMOVE BOOKMARK" : "BOOKMARK"
  );
  const { toast } = useToast();
  const router = useRouter();

  const toggleFollow = async () => {
    if (!userId) return router.push("/api/auth/signin");

    setText("...");

    const action = followId ? "delete" : "create";

    const [error] = await follow({
      userId,
      projectId,
      action,
      revalidate: window.location.pathname,
    });

    if (error) {
      console.error(error);
      setText("Error");
      toast({
        description: followId
          ? "Unable to un-bookmark project. Please try again later."
          : "Unable to bookmark project. Please try again later.",
      });
    }

    if (!error) {
      setText(followId ? "BOOKMARK" : "REMOVE BOOKMARK");
      toast({
        description: followId
          ? `You have un-bookmarked ${projectName}.`
          : `You have bookmarked ${projectName}.`,
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
        "text-center text-sm font-semibold leading-tight"
      )}
      onClick={() => toggleFollow()}
    >
      {text}
    </Button>
  );
};
