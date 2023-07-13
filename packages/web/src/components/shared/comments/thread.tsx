"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import type {
  GetCommentPageByResourceIdReturn,
  GetCommentRepliesByParentIdReturn,
} from "@nonovel/query";
import { getCommentReplies } from "~/actions";
import { CommentEdit } from "./edit";
import { CommentBody } from "./body";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Comments = NonNullable<GetCommentPageByResourceIdReturn[1]>;
type Replies = NonNullable<GetCommentRepliesByParentIdReturn[1]>;

interface CommentThreadProps {
  parent: Comments[0];
}

export const CommentThread = ({ parent }: CommentThreadProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Replies>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user.id ?? null;

  const getReplies = async () => {
    setLoading(true);
    const [, replies] = await getCommentReplies({ parentId: parent.id });
    if (replies) setReplies(replies);
    setLoading(false);
  };

  return (
    <div
      className={cn("nn-border nn-bg-background w-full rounded-md border p-6")}
    >
      <CommentBody
        username={parent.user?.profile?.username ?? ""}
        image={parent.user?.profile?.image ?? null}
        createdAt={parent.createdAt}
        updatedAt={parent.updatedAt}
        content={parent.content}
      />

      {replies.length > 0 && (
        <div className="mt-6 space-y-4 sm:ml-12">
          {replies.map((reply) => (
            <CommentBody
              key={reply.id}
              username={reply.user?.profile?.username ?? ""}
              image={reply.user?.profile?.image ?? null}
              createdAt={reply.createdAt}
              updatedAt={reply.updatedAt}
              content={reply.content}
              className="nn-border nn-bg-foreground rounded-md border p-4"
            />
          ))}
        </div>
      )}

      {loading && (
        <div className="nn-border nn-text-secondary my-4 mr-6 mt-6 rounded-md border py-6 text-center sm:ml-12">
          Loading replies...
        </div>
      )}

      <div className="mt-6">
        <div className="flex flex-wrap justify-between">
          {replies.length === 0 && (
            <>
              {parent.replyCount > 0 ? (
                <Button size="sm" onClick={getReplies}>
                  Show {parent.replyCount}{" "}
                  {parent.replyCount === 1 ? "reply" : "replies"}
                </Button>
              ) : (
                <p className="rounded-md bg-zinc-500/10 p-2 text-xs text-zinc-500/70">
                  No replies yet
                </p>
              )}
            </>
          )}
          <div className="flex-grow" />
          {userId && parent.id !== selectedId && (
            <Button size="sm" onClick={() => setSelectedId(parent.id)}>
              Reply
            </Button>
          )}
        </div>

        {userId && parent.id === selectedId && (
          <div className="mt-3 pb-3">
            <CommentEdit
              resourceId={parent.resourceId}
              cancel={() => setSelectedId(null)}
              background="nn-bg-foreground"
              userId={userId}
              parentId={parent.id}
              refresh={async () => {
                setSelectedId(null);
                await getReplies();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
