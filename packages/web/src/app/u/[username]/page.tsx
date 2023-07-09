import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getProfileByUsername } from "~/lib/request";
import { toTitleCase } from "~/lib/string";
import { cn } from "~/lib/utils";
import {
  LayoutWrapper,
  CountryCodeName,
  CountryCodeEmoji,
} from "~/components/shared";

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const [_, profile] = await getProfileByUsername({
    username: params.username,
  });

  if (!profile) notFound();

  const { projects } = profile.user;

  return (
    <>
      <div className="relative h-64 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover nn-bg-blurred"
          style={{ backgroundImage: `url(${profile.image ?? "/profile.png"})` }}
        />
      </div>
      <LayoutWrapper className="relative flex flex-wrap items-end -mt-32 md:flex-nowrap">
        <Image
          src={profile.image ?? "/profile.png"}
          alt="Profile picture"
          width={256}
          height={256}
          className="nn-bg-foreground mx-auto w-64 rounded-md border-4 border-[#FFFFFF] dark:border-[#121212] md:mx-0"
        />
        <div className="w-full mt-8 text-center md:mb-2 md:ml-8 md:mt-0 md:w-auto md:text-left">
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

      <LayoutWrapper className="mt-8 md:mt-12">
        <p className="px-0 md:px-8">{profile.bio}</p>
      </LayoutWrapper>
      <LayoutWrapper className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2">
        {!projects.length ? (
          <div className="col-span-2 p-4 text-sm text-center rounded-md nn-bg-foreground">
            @{profile.username} is not a part of any projects.
          </div>
        ) : null}

        {projects.length
          ? projects.map(({ project, ...relation }, relationIdx) => (
              <Link
                key={relationIdx}
                href={`/p/${project.slug}`}
                className={cn(
                  projects.length % 2 !== 0 ? "last:col-span-2" : null,
                  "nn-interactive nn-bg-foreground flex rounded-md"
                )}
              >
                <Image
                  src={project.cover ?? "/profile.png"}
                  alt="Novel cover"
                  width={100}
                  height={150}
                  className="mr-4 aspect-[2/3] h-full rounded-md bg-zinc-500"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold leading-tight line-clamp-1">
                    {toTitleCase(project.name)}
                  </h3>
                  <p className="mt-1 mb-4 nn-text-secondary">
                    {toTitleCase(relation.role)}
                  </p>
                  <p className="nn-text-secondary line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </Link>
            ))
          : null}
      </LayoutWrapper>
    </>
  );
}
