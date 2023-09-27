import { Metadata } from "next";
import Link from "next/link";
import { AiFillStar, AiTwotoneEye } from "react-icons/ai";
import { getFeaturedPopular } from "~/lib/server";
import { src, toTitleCase, cn, ec } from "~/lib";
import {
  LayoutWrapper,
  AspectImage,
  SectionHeading,
} from "~/components/shared";

interface PopularSliderProps {
  period: "day" | "week" | "month";
  size: number;
  titleClassName?: string;
}

export function generateMetadata(): Metadata {
  return {
    title: "NoNovel - Escape reality. Read a book.",
  };
}

const CoverGrid = async ({
  period,
  size,
  titleClassName,
}: PopularSliderProps) => {
  const [, popular] = await getFeaturedPopular({ period });
  if (!popular) return null;
  return (
    <div>
      <SectionHeading className="mt-0">
        Popular this {toTitleCase(period)}
      </SectionHeading>
      <div className="flex items-start gap-8 overflow-scroll scrollbar-none">
        {popular.map((item) => (
          <Link
            href={`/p/${item.slug}`}
            key={item.id}
            style={{ width: size }}
            className="nn-interactive block flex-shrink-0 rounded-md p-1"
          >
            <div className="relative">
              <AspectImage
                src={src(item.cover, "cover")}
                alt={item.name}
                width={size}
                className="mb-3"
              />
              <div className="absolute bottom-0 right-0 flex items-center gap-4 rounded-br-md rounded-tl-md bg-nn-base-dark/70 px-4 py-1 text-xs text-nn-base-light">
                <div className="flex items-center gap-2">
                  <AiTwotoneEye />
                  {item.views}
                </div>
                <div className="flex items-center gap-2">
                  <AiFillStar />
                  {item.review}
                </div>
              </div>
            </div>
            <p className={cn("mx-2 truncate font-bold", titleClassName)}>
              {item.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default async function HomePage() {
  const [popularError, popular] = await getFeaturedPopular({ period: "month" });

  ec(popularError, !popular);

  return (
    <>
      <LayoutWrapper className="space-y-12">
        <CoverGrid period="week" size={230} titleClassName="text-xl" />
        <CoverGrid period="month" size={150} titleClassName="text-lg" />
      </LayoutWrapper>
    </>
  );
}
