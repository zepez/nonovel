import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { AiFillStar, AiTwotoneEye } from "react-icons/ai";
import { getBrowsePageResult, getGenreBySlug } from "~/lib/request";
import { src } from "~/lib/string";
import { summarizeNumber } from "~/lib/number";
import { SectionEmpty, SectionHeading } from "~/components/shared";

interface BrowsePageProps {
  params: {
    genre: string | undefined;
  };
  searchParams: {
    sort: "new" | "old" | "popular" | undefined;
    q: string | undefined;
    page: string | undefined;
  };
}

export async function generateMetadata({
  params,
}: BrowsePageProps): Promise<Metadata> {
  const { genre: genreSlug = null } = params;

  const [, genre] = genreSlug
    ? await getGenreBySlug({ slug: genreSlug })
    : [null, null];

  return {
    title: `Browse ${genre ? genre.name.toLowerCase() : "all"} novels`,
    description: `Browse ${
      genre ? genre.name.toLowerCase() : "all"
    } novels on NoNovel.io.`,
  };
}

export default async function BrowsePage({
  params,
  searchParams,
}: BrowsePageProps) {
  const { genre: genreSlug = null } = params;
  const { sort = "popular", q = null, page: stringPage = "1" } = searchParams;

  const [, genre] = genreSlug
    ? await getGenreBySlug({ slug: genreSlug })
    : [null, null];

  const page = parseInt(stringPage);

  const [, rawResults] = await getBrowsePageResult({
    page,
    sort,
    genre: genreSlug,
    query: q,
    pageSize: 20,
  });

  const results = rawResults?.splice(0, 10);

  if ((!results || !results.length) && page > 1) {
    notFound();
  }

  if (!results || !results.length)
    return (
      <SectionEmpty className="nn-bg-background">
        No results found.
      </SectionEmpty>
    );

  return (
    <>
      <SectionHeading className="mb-0 mt-0">
        {genre?.name ?? "All Genres"}
      </SectionHeading>
      {genre?.description && (
        <p className="nn-text-secondary pb-4">{parse(genre.description)}</p>
      )}

      <section className="flex flex-row flex-wrap justify-start">
        {results.map((result) => (
          <Link
            href={`/p/${result.slug}`}
            key={result.id}
            className="nn-interactive block h-auto w-1/2 rounded-sm px-1 py-2 sm:px-4 md:w-1/4"
          >
            <div className="relative">
              <Image
                src={src(result.cover, "cover")}
                alt={`${result.name} cover`}
                width={500}
                height={750}
                className="h-auto w-full rounded-sm p-1"
              />
              <div className="absolute right-0 top-4 flex w-full justify-center md:top-5">
                <div className="flex items-center justify-center gap-1 rounded-sm bg-nn-dark/50 px-2 text-xs text-nn-light">
                  <AiTwotoneEye />
                  {summarizeNumber(result.views)}
                  <AiFillStar className="ml-2" />
                  {result.review}
                </div>
              </div>
            </div>
            <div className="flex min-w-0 flex-shrink flex-col p-1">
              <p className="truncate text-lg font-semibold sm:text-xl">
                {result.name}
              </p>
              <p className="nn-text-secondary truncate">{result.penName}</p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
