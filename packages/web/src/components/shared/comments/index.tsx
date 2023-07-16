"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useIntersection } from "react-use";
import { useSession } from "next-auth/react";

import { getCommentPage } from "~/actions";
import type { GetCommentPageByResourceIdReturn } from "@nonovel/query";
import { SectionHeading } from "../section-heading";
import { SectionEmpty } from "../section-empty";
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
        <SectionEmpty className="nn-bg-background">
          Loading comments...
        </SectionEmpty>
      )}

      {hasBeenFetched && comments.length === 0 && (
        <SectionEmpty className="nn-bg-background">
          No comments yet.
        </SectionEmpty>
      )}

      <div className="space-y-8">
        {comments.map((c) => (
          <CommentThread key={c.id} parent={c} />
        ))}
      </div>
    </section>
  );
};
