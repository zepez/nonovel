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
      <div className="h-64">
        <div
          className="nn-bg-blurred nn-bg-foreground h-full w-full bg-repeat"
          style={{
            backgroundImage: `linear-gradient(0deg, var(--nn-fade) 20%, transparent), url(${src(
              profile.image,
              "profile"
            )})`,
            backgroundSize: "300px 300px",
          }}
        />
      </div>

      <LayoutWrapper className="flex flex-wrap items-end pb-0 md:flex-nowrap">
        <Image
          src={src(profile.image, "profile")}
          alt="Profile picture"
          width={256}
          height={256}
          className="nn-bg-foreground z-20 mx-auto -mt-32 w-64 rounded-md p-1 md:mx-0"
        />
        <div className="mt-8 w-full text-center md:mb-2 md:ml-8 md:mt-0 md:w-auto md:text-left">
          <h1 className="nn-title mb-4 text-2xl font-bold md:text-5xl">
            @{profile.username.toLowerCase()}
          </h1>
          <p className="nn-text-secondary">
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
          <p className="nn-text-secondary"></p>
        </div>
      </LayoutWrapper>

      <LayoutWrapper>{children}</LayoutWrapper>
      <CommentLayout resourceId={profile.id} resourceType="profile" />
    </>
  );
}
