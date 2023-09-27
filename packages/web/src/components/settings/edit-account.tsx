"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { user as userSchema } from "@nonovel/validator";

import type { Session } from "~/lib/server";
import { updateAccount } from "~/actions";
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

interface EditAccountProps {
  session: Session;
}

const schema = userSchema.pick({
  id: true,
  email: true,
  name: true,
});

export type EditAccountSchema = z.infer<typeof schema>;

export const EditAccount = ({ session }: EditAccountProps) => {
  const { user } = session;

  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<EditAccountSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: user.id,
      email: user.email ?? "",
      name: user.name ?? "",
    },
  });

  const handleSubmit = async (values: EditAccountSchema) => {
    setLoading(true);
    const [submitError] = await updateAccount({
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
        description: "Your account has been updated.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="name"
                  className="bg-nn-secondary"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This will not be publicly visible.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email"
                  className="bg-nn-secondary"
                  readOnly
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This email will be used to send you important notifications and
                recover your account. This value can not be changed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root?.serverError && (
          <div className="rounded-md bg-red-500 p-4">
            <FormMessage className="text-nn-base-light">
              Error: {form.formState.errors.root.serverError.message}. If the
              problem persists, please contact support.
            </FormMessage>
          </div>
        )}

        {/* submit */}
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          title="Save account"
          className="font-bold"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
};
