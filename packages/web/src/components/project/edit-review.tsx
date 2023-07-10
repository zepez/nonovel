"use client";

import { useState } from "react";
import Link from "next/link";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { review as reviewSchema } from "@nonovel/validator";
import type { Review } from "@nonovel/db";

import { doReview } from "~/actions";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

interface EditReviewProps {
  projectId: Review["projectId"];
  userId?: Review["userId"];
  review?: Pick<Review, "score" | "comment"> | null;
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
  const [loading, setLoading] = useState<boolean>(false);

  const defaultSubmitText = review?.score ? "Update review" : "Submit review";
  const successVerb = review?.score ? "updated" : "submitted";

  const form = useForm<EditReviewSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId,
      projectId,
      score: review?.score ?? 0,
      comment: review?.comment ?? "",
    },
  });

  const handleSubmit = async (values: EditReviewSchema) => {
    setLoading(true);
    const [submitError] = await doReview({
      ...values,
      revalidate: window.location.pathname,
    });
    setLoading(false);

    if (submitError) {
      console.error(submitError);
      form.setError("root.serverError", {
        type: "submit",
        message: submitError.message,
      });
    }

    if (!submitError) {
      toast({
        description: `Your reivew has been ${successVerb}.`,
      });
    }
  };

  if (!userId)
    return (
      <Link
        href="/api/auth/signin"
        className="block p-4 text-center rounded-md nn-interactive nn-bg-background nn-border nn-text-secondary"
      >
        Login to submit your own review.
      </Link>
    );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* score */}
        <FormField
          control={form.control}
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Score</FormLabel>
              <FormControl>
                <Input placeholder="score" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
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
                <Textarea placeholder="I really liked..." {...field} rows={6} />
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
            <FormMessage className="text-white dark:text-white">
              Error: {form.formState.errors.root.serverError.message}. If the
              problem persists, please contact support.
            </FormMessage>
          </div>
        )}

        {/* submit */}
        <Button
          className="mt-8"
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? "Saving..." : defaultSubmitText}
        </Button>
      </form>
    </Form>
  );
};
