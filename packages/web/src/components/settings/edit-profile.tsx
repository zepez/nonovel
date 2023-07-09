"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import countries from "i18n-iso-countries";
import enLocaleData from "i18n-iso-countries/langs/en.json";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

countries.registerLocale(enLocaleData);

interface EditProfileProps {
  session: Session;
}

const schema = profileSchema.pick({
  id: true,
  username: true,
  image: true,
  countryCode: true,
});

export type EditProfileSchema = z.infer<typeof schema> & {
  userId: Session["user"]["id"];
};

export const EditProfile = ({ session }: EditProfileProps) => {
  const { profile, user } = session;

  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<EditProfileSchema>({
    resolver: zodResolver(schema),
    defaultValues: profile,
  });

  const handleSubmit = async (values: EditProfileSchema) => {
    setLoading(true);

    const [submitError] = await updateProfile({ ...values, userId: user.id });
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

  const locations = countries.getNames("en", { select: "official" });

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
                <Input
                  placeholder="Link to any image"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription>
                You can use your profile picture from other sites via a link.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* countryCode */}
        <FormField
          control={form.control}
          name="countryCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-64 h-64 sm:w-auto">
                  {Object.entries(locations).map(([code, name]) => (
                    <SelectItem key={code} value={code}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select a country code to display on your profile.
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
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
};
