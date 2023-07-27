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
          className="w-full h-full bg-cover nn-bg-blurred nn-bg-foreground"
          style={{
            backgroundImage: `url(${src(profile.image ?? "/profile.png")})`,
            backgroundSize: "cover",
          }}
        />
      </div>
      <LayoutWrapper className="flex flex-wrap items-end nn-bg-foreground md:flex-nowrap md:px-16 lg:px-16">
        <Image
          src={src(profile.image ?? "/profile.png")}
          alt="Profile picture"
          width={256}
          height={256}
          className="z-20 w-64 p-1 mx-auto -mt-32 rounded-md nn-bg-foreground md:mx-0"
        />
        <div className="w-full mt-8 text-center md:mb-2 md:ml-8 md:mt-0 md:w-auto md:text-left">
          <h1 className="mb-4 text-2xl font-bold leading-tight nn-title md:text-5xl">
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

      <LayoutWrapper className="py-12 nn-bg-foreground md:px-16 lg:px-16">
        {children}
        <CommentLayout resourceId={profile.id} resourceType="profile" />
      </LayoutWrapper>
    </>
  );
}
