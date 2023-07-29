import Link from "next/link";
import { Fragment } from "react";

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

  const projectProgressText =
    project.progress === "finished"
      ? "are available."
      : "have been published so far, and more are on the way.";

  return (
    <div className={cn(className)}>
      {toTitleCase(project.name)} is a written body of work containing elements
      of{" "}
      {project.genres.map(({ genre }, genreIdx) => (
        <Fragment key={genre.id}>
          <Link href={`/browse/${genre.slug}`} className="nn-interactive">
            {genre.name.toLowerCase()}
          </Link>
          {naturalListJoin(genreIdx, project.genres.length)}
        </Fragment>
      ))}
      . Written by{" "}
      {project.penName
        ? project.penName
        : authors.map((author, authorIdx) => (
            <Fragment key={author}>
              <Link
                href={`/u/${author}`}
                className="nn-interactive"
                title="View profile"
              >
                @{author}
              </Link>
              {naturalListJoin(authorIdx, authors.length)}
            </Fragment>
          ))}
      . {manifest.length} chapters {projectProgressText}
    </div>
  );
};
