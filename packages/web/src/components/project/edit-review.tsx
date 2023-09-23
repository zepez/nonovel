"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { review as reviewSchema } from "@nonovel/validator";
import type { Review } from "@nonovel/db";

import { doReview, deleteReview } from "~/actions";
import { SectionEmpty } from "~/components/shared";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { ReviewScore } from "~/components/project/review-score";
import { LoginDialog } from "~/components/auth";

interface EditReviewProps {
  projectId: Review["projectId"];
  userId?: Review["userId"];
  review?: Pick<Review, "id" | "score" | "comment"> | null;
}

const schema = reviewSchema.pick({
  userId: true,
  projectId: true,
  score: true,
  comment: true,
});

export type EditReviewSchema = z.infer<typeof schema>;

export const EditReview = ({ userId, projectId, review }: EditReviewProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const defaultSubmitText = review?.score ? "Update review" : "Submit review";
  const successVerb = review?.score ? "updated" : "submitted";

  const form = useForm<EditReviewSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId,
      projectId,
      score: review?.score ?? 5,
      comment: review?.comment ?? "",
    },
  });

  const handleSubmit = async (values: EditReviewSchema) => {
    if (!userId) return;

    setSaving(true);
    const [submitError] = await doReview({
      ...values,
      userId,
      revalidate: window.location.pathname,
    });
    setSaving(false);

    if (submitError) {
      console.error(submitError);
      form.setError("root.serverError", {
        type: "submit",
        message: submitError.message,
      });
    }

    if (!submitError) {
      toast({
        description: `Your review has been ${successVerb}.`,
      });
    }
  };

  const handleDelete = async () => {
    if (!review?.id || !userId) return;

    setDeleting(true);
    const [deleteError] = await deleteReview({
      id: review.id,
      userId,
      revalidate: window.location.pathname,
    });
    setDeleting(false);

    if (deleteError) {
      console.error(deleteError);
      form.setError("root.serverError", {
        type: "submit",
        message: deleteError.message,
      });
    }

    if (!deleteError) {
      toast({
        description: "Your review has been deleted.",
      });
    }
  };

  if (!userId)
    return (
      <LoginDialog>
        <SectionEmpty
          as="button"
          className="w-full cursor-pointer nn-bg-background nn-interactive"
        >
          Login to submit your own review.
        </SectionEmpty>
      </LoginDialog>
    );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* score */}
        <FormField
          control={form.control}
          name="score"
          render={({ field: { onChange, onBlur, value } }) => (
            <ReviewScore
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              className="mb-1"
              style={{ maxWidth: 175 }}
            />
          )}
        />

        {/* comment */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Comment</FormLabel>
              <FormControl>
                <Textarea
                  className="nn-bg-background"
                  placeholder="I really liked..."
                  {...field}
                  rows={6}
                />
              </FormControl>
              <FormDescription>
                Please provide a message explaining your review.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root?.serverError && (
          <div className="p-4 bg-red-500 rounded-md">
            <FormMessage className="text-nn-light">
              Error: {form.formState.errors.root.serverError.message}. If the
              problem persists, please contact support.
            </FormMessage>
          </div>
        )}

        <div className="flex flex-col-reverse flex-wrap items-center justify-between mt-2 sm:flex-row">
          {review?.id ? (
            <Button
              className="w-full mt-3 sm:w-auto"
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
              title="Delete review"
            >
              Delete review
            </Button>
          ) : null}
          <div className="flex-grow" />
          {/* submit */}
          <Button
            className="w-full mt-3 sm:w-auto"
            type="submit"
            variant="primary"
            disabled={saving}
            title="Save review"
          >
            {saving ? "Saving..." : defaultSubmitText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
