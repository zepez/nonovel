"use client";

import { useState } from "react";

import { cn } from "~/lib/utils";
import { follow } from "~/actions";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

interface ButtonFollowProps {
  className?: string;
  followId?: string;
  userId: string;
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
  const [text, setText] = useState(followId ? "remove bookmark" : "bookmark");
  const { toast } = useToast();

  const toggleFollow = async () => {
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
      setText(followId ? "bookmark" : "remove bookmark");
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
      className={cn(className)}
      onClick={() => toggleFollow()}
      title={`Bookmark ${projectName}`}
    >
      {text}
    </Button>
  );
};
