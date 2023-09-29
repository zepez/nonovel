import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { AiFillStar, AiTwotoneEye } from "react-icons/ai";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { getBrowsePageResult, getGenreBySlug } from "~/lib/server";
import { ec, src, toTitleCase, summarizeNumber, cn } from "~/lib";
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
    title: `${genre ? toTitleCase(genre.name) : "All"} Books`,
    description: `Browse ${
      genre ? toTitleCase(genre.name) : "All"
    } books on NoNovel.io.`,
  };
}

export default async function BrowsePage({
  params,
  searchParams,
}: BrowsePageProps) {
  const { genre: genreSlug = null } = params;
  const { sort = "popular", q = null, page: stringPage = "1" } = searchParams;

  const [genreErr, genre] = genreSlug
    ? await getGenreBySlug({ slug: genreSlug })
    : [null, null];

  const page = parseInt(stringPage);

  const pageSize = 8;
  const [rawResultsErr, rawResults] = await getBrowsePageResult({
    page,
    sort,
    genre: genreSlug,
    query: q,
    pageSize,
  });

  const results = rawResults?.slice(0, pageSize);
  const nextPageAvailable = rawResults?.slice(pageSize, pageSize + 1)?.length;
  const previousPageAvailable = page > 1;

  const nextPage = new URLSearchParams({
    ...(searchParams as Record<string, string>),
    page: (page + 1).toString(),
  }).toString();

  const previousPage = new URLSearchParams({
    ...(searchParams as Record<string, string>),
    page: (page - 1).toString(),
  }).toString();

  if ((!results || !results.length) && page > 1) {
    notFound();
  }

  ec(genreErr, rawResultsErr);

  if (!results || !results.length) {
    return (
      <SectionEmpty className="bg-nn-secondary">No results found.</SectionEmpty>
    );
  }

  return (
    <>
      <SectionHeading className="mt-0 mb-0">
        {genre?.name ?? "All Genres"}
      </SectionHeading>
      {genre?.description && (
        <p className="pb-4 nn-detail">{parse(genre.description)}</p>
      )}

      <section className="flex flex-wrap justify-start pt-2 gap-y-4">
        {results.map((result) => (
          <Link
            href={`/p/${result.slug}`}
            key={result.id}
            className="block w-1/2 h-auto px-1 rounded-md nn-interactive sm:px-4 md:w-1/4"
          >
            <div className="relative">
              <Image
                src={src(result.cover)}
                alt={`${result.name} cover`}
                width={500}
                height={750}
                className="w-full h-auto p-1 rounded-sm"
              />
              <div className="absolute right-0 flex justify-center w-full top-4 md:top-5">
                <div className="flex items-center justify-center gap-1 px-2 text-xs rounded-sm bg-nn-base-dark/70 text-nn-base-light">
                  <AiTwotoneEye />
                  {summarizeNumber(result.views)}
                  <AiFillStar className="ml-2" />
                  {result.review}
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-shrink min-w-0 p-1">
              <p className="text-lg font-semibold truncate sm:text-xl">
                {result.name}
              </p>
              <p className="truncate nn-detail">{result.penName}</p>
            </div>
          </Link>
        ))}
      </section>

      <nav className="flex items-center justify-center gap-4 pt-16">
        {/* 
          TODO: next/link has a bug in the client router.
          fix this when upgrading from 13.5.3-canary.3
        */}
        <a
          href={`?${previousPage}`}
          aria-disabled={!previousPageAvailable}
          className={cn(
            "bg-nn-secondary flex items-center justify-center gap-2 rounded-md px-4 py-2 text-center text-xs font-bold",
            previousPageAvailable
              ? "nn-interactive"
              : "nn-no-select pointer-events-none opacity-50"
          )}
        >
          <DoubleArrowLeftIcon /> Previous
        </a>
        <a
          href={`?${nextPage}`}
          aria-disabled={!nextPageAvailable}
          className={cn(
            "nn-interactive bg-nn-secondary flex items-center justify-center gap-2 rounded-md px-4 py-2 text-center text-xs font-bold",
            nextPageAvailable
              ? "nn-interactive"
              : "nn-no-select pointer-events-none opacity-50"
          )}
        >
          Next <DoubleArrowRightIcon />
        </a>
      </nav>
    </>
  );
}
