import Link from "next/link";

import { cn } from "~/lib/utils";
import { toTitleCase, naturalListJoin } from "~/lib/string";
import { getProjectBySlug, getChapterManifestByIds } from "~/lib/request";

interface BlurbProps {
  className?: string;
  slug: string;
}

export const Blurb = async ({ className, slug }: BlurbProps) => {
  const [, project] = await getProjectBySlug({ slug });
  if (!project) return null;

  const [, manifest] = await getChapterManifestByIds({
    projectId: project.id,
  });
  if (!manifest) return null;

  const authors = project.users
    .filter((user) => user.role === "author")
    .map((user) => user.user?.profile?.username ?? "");

  return (
    <div className={cn(className)}>
      {toTitleCase(project.name)} is a{" "}
      {project.genres.map(({ genre }, genreIdx) => (
        <Link
          href={`/browse/category/${genre.slug}`}
          key={genre.id}
          className="nn-interactive"
        >
          {genre.name.toLowerCase()}
          {naturalListJoin(genreIdx, project.genres.length)}
        </Link>
      ))}{" "}
      novel written by{" "}
      {authors.map((author, authorIdx) => (
        <Link href={`/u/${author}`} key={author} className="nn-interactive">
          @{author}
          {naturalListJoin(authorIdx, authors.length)}
        </Link>
      ))}
      . {manifest.length} chapters have been published so far, and more are on
      the way.
    </div>
  );
};
