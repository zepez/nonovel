import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProfileByUsername } from "~/lib/server";
import { toTitleCase, src, cn, ec } from "~/lib";
import { SectionHeading, SectionEmpty } from "~/components/shared";

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const [profileError, profile] = await getProfileByUsername({
    username: params.username,
  });

  if (!profile) notFound();
  ec(profileError);

  const { projects } = profile.user;

  return (
    <>
      <SectionHeading className="mt-0">About</SectionHeading>
      {profile.bio ? (
        <section>{profile.bio}</section>
      ) : (
        <SectionEmpty className="bg-nn-secondary">
          @{profile.username} does not have a bio.
        </SectionEmpty>
      )}
      <SectionHeading>Projects</SectionHeading>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {!projects.length ? (
          <SectionEmpty className="bg-nn-secondary col-span-2 rounded-md p-4 text-center text-sm">
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
                  "nn-interactive bg-nn-secondary nn-border flex rounded-md border"
                )}
              >
                <Image
                  src={src(project.cover)}
                  alt="Book cover"
                  width={100}
                  height={150}
                  className="mr-4 aspect-[2/3] h-full rounded-md bg-nn-base-dark/50"
                />
                <div className="p-4">
                  <h3 className="line-clamp-1 text-xl font-bold leading-tight">
                    {toTitleCase(project.name)}
                  </h3>
                  <p className="nn-detail mb-4 mt-1">
                    {toTitleCase(relation.role)}
                  </p>
                  <p className="nn-detail line-clamp-2">
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
