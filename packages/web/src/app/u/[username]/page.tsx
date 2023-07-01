import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getProfileByUsername } from "~/lib/request";
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
      <div className="h-64 w-full bg-zinc-500" />
      <LayoutWrapper className="-mt-32 flex flex-wrap items-end">
        <Image
          src={profile.image ?? "/profile.png"}
          alt="Profile picture"
          width={256}
          height={256}
          className="nn-outline h-64 w-64 rounded-md border-4 border-[#121212] bg-zinc-800"
        />
        <div className="mb-2 ml-8">
          <h1 className="text-5xl font-bold leading-tight ">
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
      <LayoutWrapper className="mt-12">
        <p className="px-8">{profile.bio}</p>
      </LayoutWrapper>
      <LayoutWrapper className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {profile.user.projects.map(({ project, ...relation }, relationIdx) => (
          <Link
            key={relationIdx}
            href={`/p/${project.slug}`}
            className="nn-interactive nn-bg-foreground flex rounded-md"
          >
            {/* <div className="mr-4 aspect-[2/3] h-full rounded-md bg-zinc-500"></div> */}
            <Image
              src={project.cover ?? "/profile.png"}
              alt="Novel cover"
              width={100}
              height={150}
              className="mr-4 aspect-[2/3] h-full rounded-md bg-zinc-500"
            />
            <div className="p-4">
              <h3 className="line-clamp-1 text-xl font-bold leading-tight">
                {project.name}
              </h3>
              <p className="nn-text-secondary mb-4 mt-1">{relation.role}</p>
              <p className="nn-text-secondary line-clamp-2">
                {project.description}
              </p>
            </div>
          </Link>
        ))}
      </LayoutWrapper>
    </>
  );
}
