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
  refresh: () => void;
  parent: Comments[0];
}

export const CommentThread = ({ refresh, parent }: CommentThreadProps) => {
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
        refresh={refresh}
        user={{
          userId: parent.user?.id ?? "",
          username: parent.user?.profile?.username ?? "deleted",
          image: parent.user?.profile?.image ?? null,
        }}
        comment={parent}
      />

      {replies.length > 0 && (
        <div className="mb-6 mt-4 space-y-6">
          {replies.map((reply) => (
            <CommentBody
              key={reply.id}
              refresh={getReplies}
              className="nn-border nn-bg-foreground rounded-r-md border-l-[10px] p-4 sm:ml-12"
              user={{
                userId: reply.user?.id ?? "",
                username: reply.user?.profile?.username ?? "deleted",
                image: reply.user?.profile?.image ?? null,
              }}
              comment={reply}
            />
          ))}
        </div>
      )}

      {loading && (
        <div className="nn-border nn-bg-foreground mt-4 border-l-[10px] p-4 sm:ml-12">
          Loading replies...
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-start gap-2">
        {parent.replyCount > 0 ? (
          <>
            {replies.length > 0 ? (
              <Button size="sm" onClick={() => setReplies([])}>
                Hide replies
              </Button>
            ) : (
              <Button size="sm" onClick={getReplies}>
                Show {parent.replyCount}{" "}
                {parent.replyCount === 1 ? "reply" : "replies"}
              </Button>
            )}
          </>
        ) : (
          <p className="rounded-md bg-zinc-500/10 p-2 text-xs text-zinc-500/70">
            No replies yet
          </p>
        )}
        {userId && parent.id !== selectedId && (
          <Button size="sm" onClick={() => setSelectedId(parent.id)}>
            Reply
          </Button>
        )}
      </div>

      {userId && parent.id === selectedId && (
        <div className="mt-4">
          <CommentEdit
            refresh={async () => {
              setSelectedId(null);
              await getReplies();
            }}
            cancel={() => setSelectedId(null)}
            background="nn-bg-foreground"
            defaultSubmitText="Post reply"
            actionText={["Posting", "Posted"]}
            comment={{
              resourceId: parent.resourceId,
              userId,
              parentId: parent.id,
              content: "",
            }}
          />
        </div>
      )}
    </div>
  );
};
