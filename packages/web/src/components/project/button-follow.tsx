"use client";

import { useState } from "react";

import { follow } from "~/actions";
import { cn } from "~/lib";
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
  const [text, setText] = useState(
    followId ? "remove from library" : "add to library"
  );
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
          ? "Unable to remove from library. Please try again later."
          : "Unable to add to library. Please try again later.",
      });
    }

    if (!error) {
      setText(followId ? "add to library" : "remove from library");
      toast({
        description: followId ? (
          <>
            Removed <i>{projectName}</i> from your library.
          </>
        ) : (
          <>
            Added <i>{projectName}</i> to your library.
          </>
        ),
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
      title={`Add ${projectName} to library`}
    >
      {text}
    </Button>
  );
};
