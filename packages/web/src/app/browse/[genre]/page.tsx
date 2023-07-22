import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { AiFillStar, AiTwotoneEye } from "react-icons/ai";
import { getBrowsePageResult, getGenreBySlug } from "~/lib/request";
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
      <section className="mb-8">
        <SectionHeading className="mt-0">
          {genre?.name ?? "All Genres"}
        </SectionHeading>
        <p className="nn-text-secondary">{parse(genre?.description ?? "")}</p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {results.map((result) => (
          <Link
            href={`/p/${result.slug}`}
            key={result.id}
            className="nn-interactive nn-border nn-bg-background flex flex-col rounded-md border sm:flex-row"
          >
            {result.cover && (
              <div className="h-[300px] w-full flex-shrink-0 sm:w-[200px]">
                <Image
                  src={result.cover}
                  alt={`${result.name} cover`}
                  width={200}
                  height={200}
                  className="h-full w-full rounded-md object-cover p-1"
                />
              </div>
            )}
            <div className="flex min-w-0 flex-shrink flex-col p-4">
              <p className="mb-2 text-lg leading-tight">{result.name}</p>
              <p className="nn-text-secondary flex-grow">
                {result.description?.substring(0, 200).trim()}...
              </p>
              <div className="mt-2 flex h-8 items-center gap-1 overflow-x-scroll scrollbar-none">
                <div className="nn-text-secondary mr-2 flex items-center gap-1">
                  <AiTwotoneEye />
                  {result.views}
                </div>
                <div className="nn-text-secondary mr-2 flex items-center gap-1">
                  <AiFillStar />
                  {result.review}
                </div>
                {result.genres &&
                  result.genres.map((genre) => (
                    <div
                      key={genre.name}
                      className="nn-text-secondary nn-bg-foreground nn-border flex flex-shrink-0 items-center rounded-sm border px-2 py-1"
                    >
                      {genre.name}
                    </div>
                  ))}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
