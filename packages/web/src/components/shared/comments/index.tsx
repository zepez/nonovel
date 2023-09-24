"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useIntersection } from "react-use";
import { useSession } from "next-auth/react";

import type { Comment } from "@nonovel/db";
import type { GetCommentPageByResourceIdReturn } from "@nonovel/query";
import { cn } from "~/lib/utils";
import { getCommentPage } from "~/actions";
import { Skeleton } from "~/components/ui/skeleton";
import { LoginDialog } from "~/components/auth";
import { SectionHeading } from "../section-heading";
import { SectionEmpty } from "../section-empty";
import { ClientPaginate } from "../client-paginate";
import { LayoutWrapper } from "../layout-wrapper";
import { CommentEdit } from "./edit";
import { CommentThread } from "./thread";

type Comments = NonNullable<GetCommentPageByResourceIdReturn[1]>;

interface LayoutCommentsProps {
  className?: string;
  resourceId: Comment["resourceId"];
  resourceType: Comment["resourceType"];
}

export const CommentLayout = ({
  className,
  resourceId,
  resourceType,
}: LayoutCommentsProps) => {
  const pageSize = 10;
  const { data: session } = useSession();
  const [hasBeenFetched, setHasBeenFetched] = useState<boolean>(false);
  const [comments, setComments] = useState<Comments>([]);
  const [nextPageAvailable, setNextPageAvailable] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingAnotherPage, setLoadingAnotherPage] = useState<boolean>(false);
  const intersectionRef = useRef(null);

  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });

  const getComments = useCallback(
    async (page = 1) => {
      const [err, comm] = await getCommentPage({
        userId: session?.user.id ?? null,
        resourceId,
        page,
        pageSize,
      });

      if (!err && comm && comm.length > 0) {
        setComments(comm.slice(0, pageSize));
        setNextPageAvailable(comm.length > pageSize);
        setLoadingAnotherPage(false);
      }
      setHasBeenFetched(true);
    },
    [resourceId, session]
  );

  useEffect(() => {
    void getComments(currentPage);
  }, [currentPage, getComments]);

  useEffect(() => {
    if (intersection && intersection.isIntersecting && !hasBeenFetched) {
      void getComments();
    }
  }, [intersection, hasBeenFetched, getComments]);

  const showBaseLoading = Boolean(!hasBeenFetched && !loadingAnotherPage);
  const showNoComments = Boolean(
    hasBeenFetched && !loadingAnotherPage && comments.length === 0
  );
  const showPageLoading = Boolean(loadingAnotherPage);
  const showPagination = Boolean(comments.length > 0 || loadingAnotherPage);

  return (
    <LayoutWrapper className={cn("pt-16", className)}>
      <section
        ref={intersectionRef}
        className="nn-bg-background nn-border rounded-md border px-6 pb-10 pt-8 md:px-12"
      >
        <SectionHeading className="mt-0">Comments</SectionHeading>

        {session?.user.id && (
          <CommentEdit
            refresh={getComments}
            className="mb-8"
            background="nn-bg-foreground"
            defaultSubmitText="Post comment"
            actionText={["Posting", "Posted"]}
            comment={{
              resourceId,
              resourceType,
              userId: session?.user.id,
              parentId: null,
              content: "",
            }}
          />
        )}

        {showBaseLoading && (
          <SectionEmpty className="nn-bg-foreground">
            Loading comments...
          </SectionEmpty>
        )}

        {showNoComments && session?.user.id && (
          <SectionEmpty className="nn-bg-foreground">
            No comments yet.
          </SectionEmpty>
        )}

        {showNoComments && !session?.user.id && (
          <LoginDialog>
            <SectionEmpty
              as="button"
              className="nn-bg-foreground nn-interactive w-full"
            >
              No comments yet. Login to be the first!
            </SectionEmpty>
          </LoginDialog>
        )}

        {!showNoComments && !session?.user.id && !showBaseLoading && (
          <LoginDialog>
            <SectionEmpty
              as="button"
              className="nn-bg-foreground nn-interactive mb-6 w-full"
            >
              Login to comment!
            </SectionEmpty>
          </LoginDialog>
        )}

        {showPageLoading && <Skeleton className="h-screen w-full" />}

        {comments.length > 0 && (
          <div className={"nn-bg-background rounded-md"}>
            {comments.map((c) => (
              <CommentThread key={c.id} parent={c} refresh={getComments} />
            ))}
          </div>
        )}

        {showPagination && (
          <ClientPaginate
            onPreviousClick={() => {
              setLoadingAnotherPage(true);
              setComments([]);
              setCurrentPage((c) => c - 1);
            }}
            previousDisabled={currentPage <= 1}
            onNextClick={() => {
              setLoadingAnotherPage(true);
              setComments([]);
              setCurrentPage((c) => c + 1);
            }}
            nextDisabled={!nextPageAvailable}
          />
        )}
      </section>
    </LayoutWrapper>
  );
};
