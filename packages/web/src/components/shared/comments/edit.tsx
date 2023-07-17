"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Comment } from "@nonovel/db";
import { comment as commentSchema } from "@nonovel/validator";
import { NotUndefinedOrNull } from "~/types";
import { createComment } from "~/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

interface CommentEditProps {
  refresh: () => void;
  cancel?: () => void;
  deleteFn?: () => void;
  className?: string;
  background?: string;
  defaultSubmitText: string;
  actionText: [string, string];
  comment: NotUndefinedOrNull<
    Pick<Comment, "userId" | "resourceId" | "content">
  > &
    Pick<Comment, "parentId">;
}

const schema = commentSchema.pick({
  content: true,
});

export type CommentEditSchema = z.infer<typeof schema>;

export const CommentEdit = ({
  refresh,
  cancel,
  deleteFn,
  className,
  background,
  defaultSubmitText,
  actionText,
  comment,
}: CommentEditProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const form = useForm<CommentEditSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...comment,
    },
  });

  const handleSubmit = async (values: CommentEditSchema) => {
    setSaving(true);
    console.log({ ...comment, ...values });
    const [submitError] = await createComment({
      ...comment,
      ...values,
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
        description: `Your comment has been ${actionText[1].toLowerCase()}.`,
      });
      form.reset();
      refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Comment</FormLabel>
              <FormControl>
                <Textarea
                  className={background}
                  placeholder="Type your comment here"
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-3 flex">
          {cancel && (
            <Button size="sm" variant="ghost" onClick={cancel} type="button">
              Cancel
            </Button>
          )}
          {deleteFn && (
            <Button
              size="sm"
              variant="destructive"
              onClick={deleteFn}
              type="button"
            >
              Delete comment
            </Button>
          )}
          <div className="flex-grow" />
          <Button size="sm" variant="primary" type="submit">
            {saving ? `${actionText[0]}...` : defaultSubmitText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
