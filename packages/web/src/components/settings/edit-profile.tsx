"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { profile as profileSchema } from "@nonovel/validator";

import type { Session } from "~/lib/auth";
import { updateProfile } from "~/actions";
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
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

interface EditProfileProps {
  session: Session;
}

const schema = profileSchema.pick({
  id: true,
  username: true,
  image: true,
});

export type EditProfileSchema = z.infer<typeof schema>;

export const EditProfile = ({ session }: EditProfileProps) => {
  const { profile } = session;

  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<EditProfileSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: profile.id,
      username: profile.username,
      image: profile.image ?? "",
    },
  });

  const handleSubmit = async (values: EditProfileSchema) => {
    setLoading(true);
    const [submitError] = await updateProfile(values);
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
        description: "Your profile has been updated.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>
                Usernames must be unique and can only contain alphanumeric and
                underscore characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* profile picture */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <Input placeholder="Link to any image" {...field} />
              </FormControl>
              <FormDescription>
                You can use your profile picture from other sites via a link.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root?.serverError && (
          <div className="rounded-md bg-red-500 p-4">
            <FormMessage className="text-white dark:text-white">
              Error: {form.formState.errors.root.serverError.message}. If the
              problem persists, please contact support.
            </FormMessage>
          </div>
        )}

        {/* submit */}
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
};
