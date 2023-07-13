"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useIntersection } from "react-use";
import { useSession } from "next-auth/react";

import { getCommentPage } from "~/actions";
import type { GetCommentPageByResourceIdReturn } from "@nonovel/query";
import { SectionHeading } from "../section-heading";
import { CommentEdit } from "./edit";
import { CommentThread } from "./thread";

type Comments = NonNullable<GetCommentPageByResourceIdReturn[1]>;

interface LayoutCommentsProps {
  resourceId: string;
}

export const CommentLayout = ({ resourceId }: LayoutCommentsProps) => {
  const { data: session } = useSession();
  const [hasBeenFetched, setHasBeenFetched] = useState(false);
  const [comments, setComments] = useState<Comments>([]);
  const intersectionRef = useRef(null);

  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });

  const getComments = useCallback(async () => {
    const [err, comm] = await getCommentPage({
      resourceId,
      page: 1,
      pageSize: 10,
    });

    if (!err && comm && comm.length > 0) {
      setComments(comm);
    }

    setHasBeenFetched(true);
  }, [resourceId]);

  useEffect(() => {
    if (intersection && intersection.isIntersecting && !hasBeenFetched) {
      void getComments();
    }
  }, [intersection, hasBeenFetched, getComments]);

  return (
    <section ref={intersectionRef}>
      <SectionHeading>Comments</SectionHeading>

      {session?.user.id && (
        <CommentEdit
          background="nn-bg-background"
          className="mb-8"
          resourceId={resourceId}
          userId={session?.user.id}
          parentId={null}
          refresh={getComments}
        />
      )}

      {!hasBeenFetched && (
        <div className="nn-text-secondary nn-bg-background nn-border w-full rounded-md border py-8 text-center">
          <p>Loading comments...</p>
        </div>
      )}

      {hasBeenFetched && comments.length === 0 && (
        <div className="nn-text-secondary nn-bg-background nn-border w-full rounded-md border py-8 text-center">
          <p>No comments yet.</p>
        </div>
      )}

      <div className="space-y-8">
        {comments.map((c) => (
          <CommentThread key={c.id} parent={c} />
        ))}
      </div>
    </section>
  );
};
