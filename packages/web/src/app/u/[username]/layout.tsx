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
      <div className="h-64 overflow-hidden">
        <div
          className="nn-bg-blurred nn-bg-foreground h-full w-full bg-cover"
          style={{
            backgroundImage: `url(${profile.image ?? "/profile.png"})`,
            backgroundSize: "cover",
          }}
        />
      </div>
      <LayoutWrapper className="nn-bg-foreground flex flex-wrap items-end md:flex-nowrap md:px-16 lg:px-16">
        <Image
          src={src(profile.image ?? "/profile.png")}
          alt="Profile picture"
          width={256}
          height={256}
          className="nn-bg-foreground z-20 mx-auto -mt-32 w-64 rounded-md p-1 md:mx-0"
        />
        <div className="mt-8 w-full text-center md:mb-2 md:ml-8 md:mt-0 md:w-auto md:text-left">
          <h1 className="mb-4 text-2xl font-bold leading-tight md:text-5xl">
            <span className="mr-1 text-xl font-normal">@</span>
            {profile.username.toLowerCase()}
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

      <LayoutWrapper className="nn-bg-foreground py-12 md:px-16 lg:px-16">
        {children}
        <CommentLayout resourceId={profile.id} resourceType="profile" />
      </LayoutWrapper>
    </>
  );
}
