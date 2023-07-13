"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { comment as commentSchema } from "@nonovel/validator";
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
  cancel?: () => void;
  className?: string;
  background?: string;
  resourceId: string;
  userId: string;
  parentId: string | null;
  refresh: () => void;
}

const schema = commentSchema.pick({
  content: true,
});

export type CommentEditSchema = z.infer<typeof schema>;

export const CommentEdit = ({
  cancel,
  className,
  background,
  userId,
  resourceId,
  parentId,
  refresh,
}: CommentEditProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const form = useForm<CommentEditSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (values: CommentEditSchema) => {
    setSaving(true);
    const [submitError] = await createComment({
      ...values,
      userId,
      resourceId,
      parentId,
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
        description: "Your comment has been posted.",
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
          <div className="flex-grow" />
          <Button size="sm" variant="primary" type="submit">
            {saving ? "Posting..." : "Comment"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
