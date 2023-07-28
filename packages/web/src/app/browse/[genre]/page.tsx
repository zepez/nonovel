import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { AiFillStar, AiTwotoneEye } from "react-icons/ai";
import { getBrowsePageResult, getGenreBySlug } from "~/lib/request";
import { src, clamp } from "~/lib/string";
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
            className="flex flex-col border rounded-md nn-interactive nn-border nn-bg-background sm:flex-row"
          >
            <div className="h-[300px] w-full flex-shrink-0 sm:w-[200px]">
              <Image
                src={src(result.cover, "cover")}
                alt={`${result.name} cover`}
                width={200}
                height={200}
                className="object-cover w-full h-full p-1 rounded-md"
              />
            </div>

            <div className="flex flex-col flex-shrink min-w-0 p-4">
              <p className="mb-2 text-xl leading-tight nn-title">
                {result.name}
              </p>
              <p className="flex-grow nn-text-secondary">
                {clamp(result.description, 200)}...
              </p>
              <div className="flex items-center h-8 gap-1 mt-2 overflow-x-scroll scrollbar-none">
                <div className="flex items-center gap-1 mr-2 nn-text-secondary">
                  <AiTwotoneEye />
                  {result.views}
                </div>
                <div className="flex items-center gap-1 mr-2 nn-text-secondary">
                  <AiFillStar />
                  {result.review}
                </div>
                {result.genres &&
                  result.genres.map((genre) => (
                    <div
                      key={genre.name}
                      className="flex items-center flex-shrink-0 px-2 py-1 border rounded-sm nn-text-secondary nn-bg-foreground nn-border"
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
