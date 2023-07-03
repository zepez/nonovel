import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getProfileByUsername } from "~/lib/request";
import { toTitleCase } from "~/lib/string";
import { LayoutWrapper } from "~/components/shared";

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const [_, profile] = await getProfileByUsername({
    username: params.username,
  });

  if (!profile) notFound();

  return (
    <>
      <div className="relative h-64 overflow-hidden">
        <div
          className="nn-bg-blurred absolute inset-0 h-full w-full"
          style={{ backgroundImage: `url(${profile.image ?? "/profile.png"})` }}
        />
      </div>
      <LayoutWrapper className="relative -mt-32 flex flex-wrap items-end md:flex-nowrap">
        <Image
          src={profile.image ?? "/profile.png"}
          alt="Profile picture"
          width={256}
          height={256}
          className="nn-outline nn-bg-foreground mx-auto w-64 rounded-md border-4 border-[#FFFFFF] dark:border-[#121212] md:mx-0"
        />
        <div className="mt-8 w-full text-center md:mb-2 md:ml-8 md:mt-0 md:w-auto md:text-left">
          <h1 className="mb-2 text-2xl font-bold leading-tight md:text-5xl">
            <span className="mr-1 text-xl font-normal">@</span>
            {profile.username.toLowerCase()}
          </h1>
          <p className="nn-text-secondary">
            Joined {formatDistanceToNow(profile.createdAt, { addSuffix: true })}{" "}
            | Based in Ukraine 🇺🇦
          </p>
          <p className="nn-text-secondary"></p>
        </div>
      </LayoutWrapper>

      <LayoutWrapper className="mt-8 md:mt-12">
        <p className="px-0 md:px-8">{profile.bio}</p>
      </LayoutWrapper>
      <LayoutWrapper className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {!profile.user.projects.length ? (
          <div className="nn-bg-foreground col-span-2 rounded-md p-4 text-center text-sm">
            @{profile.username} is not a part of any projects.
          </div>
        ) : null}

        {profile.user.projects.length
          ? profile.user.projects.map(
              ({ project, ...relation }, relationIdx) => (
                <Link
                  key={relationIdx}
                  href={`/p/${project.slug}`}
                  className="nn-interactive nn-bg-foreground flex rounded-md"
                >
                  <Image
                    src={project.cover ?? "/profile.png"}
                    alt="Novel cover"
                    width={100}
                    height={150}
                    className="mr-4 aspect-[2/3] h-full rounded-md bg-zinc-500"
                  />
                  <div className="p-4">
                    <h3 className="line-clamp-1 text-xl font-bold leading-tight">
                      {toTitleCase(project.name)}
                    </h3>
                    <p className="nn-text-secondary mb-4 mt-1">
                      {toTitleCase(relation.role)}
                    </p>
                    <p className="nn-text-secondary line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </Link>
              )
            )
          : null}
      </LayoutWrapper>
    </>
  );
}
