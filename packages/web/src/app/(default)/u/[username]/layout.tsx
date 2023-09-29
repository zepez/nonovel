import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getProfileByUsername } from "~/lib/server";
import { ec } from "~/lib";
import {
  LayoutWrapper,
  CountryCodeName,
  CountryCodeEmoji,
  CommentLayout,
  LayoutProfileImage,
} from "~/components/shared";

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: { username: string };
}

export default async function ProfileLayout({
  children,
  params,
}: ProfileLayoutProps) {
  const [profileError, profile] = await getProfileByUsername({
    username: params.username,
  });

  if (!profile) notFound();
  ec(profileError);

  return (
    <>
      <LayoutWrapper className="flex flex-wrap items-end pb-16 md:flex-nowrap">
        <LayoutProfileImage
          seed={profile.username}
          size={256}
          className="relative -z-10 blur-3xl"
        />
        <LayoutProfileImage
          seed={profile.username}
          size={256}
          className="absolute"
        />
        <div className="mt-8 w-full text-center md:mb-2 md:ml-8 md:mt-0 md:w-auto md:text-left">
          <h1 className="nn-title mb-4">@{profile.username.toLowerCase()}</h1>
          <p className="nn-detail">
            Joined {formatDistanceToNow(profile.createdAt, { addSuffix: true })}{" "}
            <CountryCodeName code={profile.countryCode}>
              {(countryName) => (
                <span>
                  | Located in {countryName}{" "}
                  <CountryCodeEmoji code={profile.countryCode} />
                </span>
              )}
            </CountryCodeName>
          </p>
        </div>
      </LayoutWrapper>

      <LayoutWrapper>{children}</LayoutWrapper>
    </>
  );
}
