"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import countries from "i18n-iso-countries";
import enLocaleData from "i18n-iso-countries/langs/en.json";

import { profile as profileSchema } from "@nonovel/validator";

import type { Session } from "~/lib/server";
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
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { LayoutProfileImage } from "~/components/shared";

countries.registerLocale(enLocaleData);

interface EditProfileProps {
  session: Session;
}

const schema = profileSchema.pick({
  id: true,
  username: true,
  countryCode: true,
  bio: true,
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

  const profileImageSeed = useWatch({
    control: form.control,
    name: "username",
    defaultValue: profile.username,
  });

  const handleSubmit = async (values: EditProfileSchema) => {
    setLoading(true);

    const [submitError] = await updateProfile({
      ...values,
      userId: user.id,
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
        description: "Your profile has been updated.",
      });
    }
  };

  const locations = countries.getNames("en", { select: "official" });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-y-12"
      >
        <div className="flex flex-wrap items-start justify-start gap-x-12 gap-y-12 md:flex-nowrap">
          <LayoutProfileImage
            seed={profileImageSeed}
            size={256}
            className="flex w-full flex-shrink-0 justify-center md:w-auto"
          />

          <div className="flex flex-col gap-y-12">
            {/* username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      className="bg-nn-secondary"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Usernames must be unique and can only contain alphanumeric
                    and underscore characters.
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
                      <SelectTrigger className="bg-nn-secondary">
                        <SelectValue placeholder="Choose a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-nn-secondary h-64 w-64 sm:w-auto">
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
          </div>
        </div>

        {/* bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Find something interesting about yourself."
                  className="bg-nn-secondary"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription>
                Tell the world a little bit about yourself.
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
          title="Save profile"
          className="font-bold"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
};
