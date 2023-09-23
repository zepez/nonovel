import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProfileByUsername } from "~/lib/request";
import { toTitleCase, src } from "~/lib/string";
import { cn } from "~/lib/utils";
import { SectionHeading, SectionEmpty } from "~/components/shared";

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const [, profile] = await getProfileByUsername({
    username: params.username,
  });
  if (!profile) notFound();

  const { projects } = profile.user;

  return (
    <>
      <SectionHeading className="mt-0">About</SectionHeading>
      {profile.bio ? (
        <section>{profile.bio}</section>
      ) : (
        <SectionEmpty className="nn-bg-background">
          @{profile.username} does not have a bio.
        </SectionEmpty>
      )}
      <SectionHeading>Projects</SectionHeading>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {!projects.length ? (
          <SectionEmpty className="col-span-2 p-4 text-sm text-center rounded-md nn-bg-background">
            @{profile.username} is not a part of any projects.
          </SectionEmpty>
        ) : null}

        {projects.length
          ? projects.map(({ project, ...relation }) => (
              <Link
                key={project.id}
                href={`/p/${project.slug}`}
                className={cn(
                  projects.length % 2 !== 0 ? "last:col-span-2" : null,
                  "nn-interactive nn-bg-background nn-border flex rounded-md border"
                )}
              >
                <Image
                  src={src(project.cover, "cover")}
                  alt="Novel cover"
                  width={100}
                  height={150}
                  className="mr-4 aspect-[2/3] h-full rounded-md bg-nn-dark/50"
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
      </div>
    </>
  );
}
