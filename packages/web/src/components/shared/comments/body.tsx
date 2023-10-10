"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import {
  FiThumbsUp,
  FiThumbsDown,
  FiX,
  FiEdit2,
  FiMessageCircle,
  FiPlus,
} from "react-icons/fi";

import type {
  GetCommentPageByResourceIdReturn,
  GetCommentRepliesByParentIdReturn,
} from "@nonovel/query";
import { upsertVote, getCommentReplies } from "~/actions";
import { cn } from "~/lib";
import { LayoutProfileImage } from "../layout-profile-image";
import { CommentEdit } from "./edit";
import { CommentNavButton } from "./nav-button";

type Comments = NonNullable<GetCommentPageByResourceIdReturn[1]>;
type Replies = NonNullable<GetCommentRepliesByParentIdReturn[1]>;

interface CommentBodyProps {
  className?: string;
  refresh: () => void;
  comment: Comments[0];
  isReply?: boolean;
}

export const CommentBody = ({
  className,
  refresh,
  comment,
  isReply,
}: CommentBodyProps) => {
  const { data: session } = useSession();

  const userId = session?.user.id ?? null;
  const username = comment?.profile?.username ?? "deleted";
  const isCreator = comment?.user?.id === session?.user.id;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [loadingReplies, setLoadingReplies] = useState<boolean>(false);
  const [replies, setReplies] = useState<Replies>([]);

  const createdAt = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });
  const updatedAt = formatDistanceToNow(new Date(comment.updatedAt), {
    addSuffix: true,
  });

  const getReplies = async () => {
    setLoadingReplies(true);
    const [, replies] = await getCommentReplies({
      parentId: comment.id,
      userId: userId,
    });
    if (replies) setReplies(replies);
    setLoadingReplies(false);
  };

  const handleVote = async (direction: "up" | "down") => {
    if (!userId) return;

    await upsertVote({
      userId,
      resourceId: comment.id,
      direction,
      voteCurrent: comment.voteCurrent,
      resourceType: "comment",
      revalidate: window.location.pathname,
    });

    refresh();
  };

  return (
    <div className={cn(className)}>
      {/* comment header */}
      <div className="flex gap-4">
        <div>
          <LayoutProfileImage seed={username} size={35} />
        </div>
        <div className="flex-grow">
          <p className="mb-1 text-sm font-bold leading-tight">@{username}</p>
          <p className="nn-detail text-xs">
            Commented {createdAt}
            {createdAt !== updatedAt && <>, edited {updatedAt}</>}
          </p>
        </div>
      </div>

      {/* comment body || comment edit */}
      {userId && isEditing ? (
        <CommentEdit
          refresh={() => {
            setIsEditing(false);
            refresh();
          }}
          deleteFn={() => null}
          comment={{ ...comment, userId }}
          background={comment.parentId ? "bg-nn-secondary" : "bg-nn-base"}
          className="mb-4"
          defaultSubmitText="Update Comment"
          actionText={["Updating", "Updated"]}
        />
      ) : (
        <p className="text-md my-4 whitespace-pre-wrap">{comment.content}</p>
      )}

      {/* comment actions */}
      <div className="flex flex-col flex-wrap gap-y-1 sm:flex-row sm:flex-nowrap">
        <div className="mr-2 flex items-center gap-x-1 pb-2 sm:pb-0">
          {/* like comment */}
          <CommentNavButton
            Icon={FiThumbsUp}
            disabled={!userId || username === "deleted"}
            onClick={async () => await handleVote("up")}
            className={cn(comment.voteCurrent > 0 && "bg-green-500/20")}
            title="Like comment"
          />

          {/* dislike comment */}
          <CommentNavButton
            Icon={FiThumbsDown}
            disabled={!userId || username === "deleted"}
            onClick={async () => await handleVote("down")}
            className={cn(comment.voteCurrent < 0 && "bg-red-500/20")}
            title="Dislike comment"
          />

          {/* like count */}
          <span className="nn-detail ml-2">
            {comment.voteTotal} like
            {comment.voteTotal.toString() !== "1" &&
              comment.voteTotal.toString() !== "-1" &&
              "s"}
          </span>
        </div>

        {/* edit comment */}
        {isCreator && comment.content !== "[deleted]" && (
          <div className="nn-border flex items-center sm:ml-2 sm:border-l-2 sm:pl-2">
            {isEditing ? (
              <CommentNavButton
                Icon={FiX}
                onClick={() => setIsEditing(false)}
                title="Cancel editing"
                showTitle
              />
            ) : (
              <CommentNavButton
                Icon={FiEdit2}
                onClick={() => setIsEditing(true)}
                title="Edit comment"
                showTitle
              />
            )}
          </div>
        )}

        {/* reply actions */}
        {!isReply && (
          <div className="nn-border flex gap-2 sm:ml-2 sm:border-l-2 sm:pl-2">
            {/* no replies */}
            {comment.replyCount === 0 && (
              <CommentNavButton
                Icon={FiMessageCircle}
                onClick={() => {}}
                title="No replies yet"
                showTitle
                disabled={true}
              />
            )}

            {/* toggle on replies */}
            {comment.replyCount > 0 && replies.length === 0 && (
              <CommentNavButton
                Icon={FiMessageCircle}
                onClick={getReplies}
                title={
                  loadingReplies
                    ? "Loading..."
                    : `Show ${comment.replyCount} ${
                        comment.replyCount === 1 ? "reply" : "replies"
                      }`
                }
                showTitle
                disabled={loadingReplies}
              />
            )}

            {/* toggle off replies */}
            {comment.replyCount > 0 && replies.length > 0 && (
              <CommentNavButton
                Icon={FiX}
                onClick={() => setReplies([])}
                title="Hide replies"
                showTitle
              />
            )}
          </div>
        )}

        {/* create a reply */}
        {!isReply && !isReplying && (
          <div className="nn-border flex gap-2 sm:ml-2 sm:border-l-2 sm:pl-2">
            <CommentNavButton
              Icon={FiPlus}
              onClick={() => setIsReplying(true)}
              title="Reply"
              showTitle
            />
          </div>
        )}
      </div>

      {/* display replies */}
      {replies.length > 0 && (
        <div className="mb-6 mt-4 space-y-4">
          {replies.map((reply) => (
            <CommentBody
              key={reply.id}
              refresh={getReplies}
              className="bg-nn-base rounded-md p-8 sm:ml-12"
              comment={reply}
              isReply={true}
            />
          ))}
        </div>
      )}

      {userId && isReplying && (
        <div className="mt-4">
          <CommentEdit
            refresh={async () => {
              setIsReplying(false);
              await getReplies();
            }}
            cancel={() => setIsReplying(false)}
            background="bg-nn-base"
            defaultSubmitText="Post Reply"
            actionText={["Posting", "Posted"]}
            comment={{
              resourceId: comment.resourceId,
              resourceType: comment.resourceType,
              userId,
              parentId: comment.id,
              content: "",
            }}
          />
        </div>
      )}
    </div>
  );
};
