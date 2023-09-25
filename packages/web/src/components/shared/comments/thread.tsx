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
    const [, replies] = await getCommentReplies({
      parentId: parent.id,
      userId: session?.user.id ?? null,
    });
    if (replies) setReplies(replies);
    setLoading(false);
  };

  return (
    <div className={cn("nn-border w-full border-t py-6 last:border-b")}>
      <CommentBody
        refresh={refresh}
        user={{
          userId: parent.user?.id ?? "",
          username: parent?.profile?.username ?? "deleted",
          image: parent?.profile?.image ?? null,
        }}
        comment={parent}
      />

      {replies.length > 0 && (
        <div className="mb-6 mt-4 divide-y">
          {replies.map((reply) => (
            <CommentBody
              key={reply.id}
              refresh={getReplies}
              className="nn-border bg-nn-base border-l-[10px] p-8 sm:ml-12"
              user={{
                userId: reply.user?.id ?? "",
                username: reply?.profile?.username ?? "deleted",
                image: reply?.profile?.image ?? null,
              }}
              comment={reply}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-start gap-2">
        {parent.replyCount > 0 ? (
          <>
            {replies.length > 0 ? (
              <Button
                size="sm"
                onClick={() => setReplies([])}
                title="Hide replies"
              >
                Hide replies
              </Button>
            ) : (
              <Button size="sm" onClick={getReplies} title="Show replies">
                {loading ? (
                  <>Loading...</>
                ) : (
                  <>
                    Show {parent.replyCount}{" "}
                    {parent.replyCount === 1 ? "reply" : "replies"}
                  </>
                )}
              </Button>
            )}
          </>
        ) : (
          <p className="bg-nn-base rounded-md p-2 text-xs opacity-50">
            No replies yet
          </p>
        )}
        {userId && parent.id !== selectedId && (
          <Button
            size="sm"
            onClick={() => setSelectedId(parent.id)}
            title="Reply to comment"
          >
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
            background="bg-nn-base"
            defaultSubmitText="Post Reply"
            actionText={["Posting", "Posted"]}
            comment={{
              resourceId: parent.resourceId,
              resourceType: parent.resourceType,
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
