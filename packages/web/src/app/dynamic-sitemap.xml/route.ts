import { db } from "@nonovel/db";

import { getServerSideSitemap } from "next-sitemap";

export async function GET() {
  const projects = await db.query.project.findMany({
    columns: {
      slug: true,
      updatedAt: true,
    },
    with: {
      chapters: {
        columns: {
          order: true,
          updatedAt: true,
        },
      },
    },
  });

  return getServerSideSitemap([
    {
      loc: "https://nonovel.io",
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 1,
    },
    ...projects.map((project) => ({
      loc: `https://nonovel.io/p/${project.slug}`,
      lastmod: project.updatedAt.toISOString(),
      priority: 0.8,
    })),
    ...projects
      .map((project) =>
        project.chapters.map((chapter) => ({
          loc: `https://nonovel.io/p/${project.slug}/chapters/${chapter.order}`,
          lastmod: chapter.updatedAt.toISOString(),
          priority: 0.5,
        }))
      )
      .flat(),
  ]);
}
