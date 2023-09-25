import Image from "next/image";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getProfileByUsername } from "~/lib/request";
import { src } from "~/lib/string";
import {
  LayoutWrapper,
  CountryCodeName,
  CountryCodeEmoji,
  CommentLayout,
  BackgroundImage,
} from "~/components/shared";

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: { username: string };
}

export default async function ProfileLayout({
  children,
  params,
}: ProfileLayoutProps) {
  const [, profile] = await getProfileByUsername({
    username: params.username,
  });
  if (!profile) notFound();

  return (
    <>
      <BackgroundImage src={src(profile.image, "profile")} tiled={true}>
        <LayoutWrapper className="flex flex-wrap items-end pb-16 md:flex-nowrap">
          <Image
            src={src(profile.image, "profile")}
            alt="Profile picture"
            width={256}
            height={256}
            className="mx-auto w-64 rounded-md bg-nn-backdrop-dark p-1 md:mx-0"
          />
          <div className="mt-8 w-full text-center md:mb-2 md:ml-8 md:mt-0 md:w-auto md:text-left">
            <h1 className="nn-title mb-4">@{profile.username.toLowerCase()}</h1>
            <p className="nn-text-secondary">
              Joined{" "}
              {formatDistanceToNow(profile.createdAt, { addSuffix: true })}{" "}
              <CountryCodeName code={profile.countryCode}>
                {(countryName) => (
                  <span>
                    | Located in {countryName}{" "}
                    <CountryCodeEmoji code={profile.countryCode} />
                  </span>
                )}
              </CountryCodeName>
            </p>
            <p className="nn-text-secondary"></p>
          </div>
        </LayoutWrapper>
      </BackgroundImage>

      <LayoutWrapper>{children}</LayoutWrapper>
      <CommentLayout resourceId={profile.id} resourceType="profile" />
    </>
  );
}
