"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { GetUserByIdReturn } from "@nonovel/query";
import { user as userSchema } from "@nonovel/validator";

import { updateAccount } from "~/actions";
import { Button } from "~/components/ui/button";
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

interface EditAccountProps {
  session: NonNullable<GetUserByIdReturn[1]>;
}

const schema = userSchema.pick({
  id: true,
  email: true,
  name: true,
});

export type EditAccountSchema = z.infer<typeof schema>;

export const EditAccount = ({ session }: EditAccountProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<EditAccountSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: session.id,
      email: session.email ?? "",
      name: session.name ?? "",
    },
  });

  const handleSubmit = async (values: EditAccountSchema) => {
    setLoading(true);
    const [submitError] = await updateAccount(values);
    setLoading(false);

    if (submitError) {
      console.error(submitError);
      form.setError("root.serverError", {
        type: "submit",
        message: submitError.message,
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
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormDescription>
                This value will be displayed along side your profile username.
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
                <Input placeholder="email" readOnly {...field} />
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
