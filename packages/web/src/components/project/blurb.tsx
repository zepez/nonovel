import Link from "next/link";

import { cn } from "~/lib/utils";
import { toTitleCase } from "~/lib/string";
import { getProjectBySlug } from "~/lib/request";

interface BlurbProps {
  className?: string;
  slug: string;
}

export const Blurb = async ({ className, slug }: BlurbProps) => {
  const [_projectErr, project] = await getProjectBySlug({ slug });

  if (!project) return null;

  const naturalListJoin = (index: number, length: number) => {
    const total = length - 1;

    if (index === total) return "";
    if (index === total - 1) return " and ";
    return ", ";
  };

  const authors = project.users
    .filter((user) => user.role === "author")
    .map((user) => user.user?.profile?.username ?? "");

  return (
    <div className={cn(className)}>
      {toTitleCase(project.name)} is a{" "}
      {project.genres.map(({ genre }, genreIdx) => (
        <Link
          href={`/browse/category/${genre.slug}`}
          key={genreIdx}
          className="nn-interactive"
        >
          {genre.name.toLowerCase()}
          {naturalListJoin(genreIdx, project.genres.length)}
        </Link>
      ))}{" "}
      novel written by{" "}
      {authors.map((author, authorIdx) => (
        <Link href={`/u/${author}`} key={authorIdx} className="nn-interactive">
          @{author}
          {naturalListJoin(authorIdx, authors.length)}
        </Link>
      ))}
      . {project.chapters.length} chapters have been published so far, and more
      are on the way.
    </div>
  );
};
