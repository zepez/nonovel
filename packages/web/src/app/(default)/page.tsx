import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AiFillStar, AiTwotoneEye } from "react-icons/ai";
import { getFeaturedPopular } from "~/lib/request";
import {
  LayoutWrapper,
  AspectImage,
  SectionHeading,
  BackgroundImage,
} from "~/components/shared";
import { src, toTitleCase } from "~/lib/string";
import { cn } from "~/lib/utils";

interface PopularSliderProps {
  period: "day" | "week" | "month";
  size: number;
  titleClassName?: string;
}

export function generateMetadata(): Metadata {
  return {
    title: "Home | NoNovel | Read Novel Online Free",
  };
}

const PopularSlider = async ({
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
              <div className="absolute bottom-0 right-0 flex items-center gap-4 rounded-br-md rounded-tl-md bg-nn-dark/50 px-4 py-1 text-xs text-nn-light">
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
            <p className={cn("nn-title mx-2", titleClassName)}>{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default async function HomePage() {
  const [, popularTodayAll] = await getFeaturedPopular({ period: "day" });
  if (!popularTodayAll) return notFound();
  const popularToday = popularTodayAll[0];

  return (
    <main>
      <BackgroundImage src={src(popularToday.cover, "cover")}>
        <Link
          href={`/p/${popularToday.slug}`}
          className="nn-interactive relative z-10 flex items-center py-12"
        >
          <LayoutWrapper className="py-0">
            <SectionHeading className="mt-0">Top Today</SectionHeading>
            <div className="flex flex-wrap gap-6 sm:flex-nowrap">
              <AspectImage
                src={src(popularToday.cover, "cover")}
                alt={popularToday.name}
                width={200}
                className="mx-auto mb-3 flex-shrink-0"
              />
              <div className="min-w-0 flex-shrink pt-2">
                <p className="nn-title mb-2 text-3xl font-bold italic">
                  {popularToday.name}
                </p>
                <p>{popularToday.description}</p>
              </div>
            </div>
          </LayoutWrapper>
        </Link>
      </BackgroundImage>

      <LayoutWrapper className="space-y-12">
        <PopularSlider period="week" size={230} titleClassName="text-xl" />
        <PopularSlider period="month" size={150} titleClassName="text-lg" />
      </LayoutWrapper>
    </main>
  );
}
