import assert from "node:assert";
import { Metadata } from "next";
import Link from "next/link";
import type { GetFeaturedPopularReturn } from "@nonovel/query";
import { getFeaturedPopular } from "~/lib/server";
import { src, toTitleCase, ec, cn } from "~/lib";
import {
  LayoutWrapper,
  AspectImage,
  SectionHeading,
} from "~/components/shared";

export function generateMetadata(): Metadata {
  return {
    title: "NoNovel - Escape reality. Read a book.",
  };
}

interface BackgroundImageProps {
  children?: React.ReactNode;
  className?: string;
  src: string | null;
}

const BackgroundImage = ({
  src,
  children,
  className,
}: BackgroundImageProps) => {
  return (
    <div className="relative">
      <div
        className="nn-bg-header-image absolute inset-0 -z-10 bg-cover"
        style={{
          backgroundImage: `linear-gradient(0deg, var(--nn-fade) 15%, transparent), linear-gradient(180deg, var(--nn-fade) 0%, transparent 30%), url(${src})`,
          backgroundPosition: "center center",
        }}
      />
      <div className={cn("nn-bg-header-image z-10", className)}>{children}</div>
    </div>
  );
};

interface CoverGridProps {
  title: string;
  projects: NonNullable<GetFeaturedPopularReturn[1]>;
  className?: string;
  itemClassName?: string;
}

const CoverGrid = async ({
  title,
  projects,
  className,
  itemClassName,
}: CoverGridProps) => {
  return (
    <>
      <SectionHeading className="mt-0">{title}</SectionHeading>
      <div className={cn("flex flex-wrap justify-start gap-y-4", className)}>
        {projects.map((project) => (
          <Link
            href={`/p/${project.slug}`}
            key={project.id}
            className={cn("nn-interactive block h-auto px-2", itemClassName)}
          >
            <AspectImage
              src={src(project.cover, "cover")}
              alt={project.name}
              width={300}
              className="mb-3"
            />
            <p className="truncate text-xl font-bold">
              {toTitleCase(project.name)}
            </p>
            <p className="truncate">
              {toTitleCase(project.penName ?? "Unknown Author")}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default async function HomePage() {
  const [popularError, popular] = await getFeaturedPopular({
    period: "all",
    limit: 6,
  });

  ec(popularError);
  assert.ok(popular?.length, "No popular projects found");

  return (
    <>
      <BackgroundImage src="images/home/header-min.jpg">
        <LayoutWrapper className="flex h-screen flex-col">
          <div className="flex-grow" />
          <div className="h-1/2 sm:h-3/5 md:h-2/3">
            <h1 className="font-serif text-[5rem] leading-[4.3rem] tracking-tighter sm:text-[7rem] sm:leading-[6rem] md:text-[12rem] md:leading-[10rem]">
              Escape
              <br />
              <span className="-ml-1 pl-10 sm:pl-14 md:-ml-2 md:pl-24">
                Reality
              </span>
            </h1>
            <h2 className="pl-10 text-2xl font-bold text-nn-accent-light dark:text-nn-accent-dark sm:pl-14 md:block md:pl-24 md:text-4xl">
              Read a book.
            </h2>
          </div>
        </LayoutWrapper>
      </BackgroundImage>
      <LayoutWrapper className="-mt-28">
        <CoverGrid
          title="Popular"
          projects={popular}
          itemClassName="w-1/2 sm:w-1/3 lg:w-1/6"
        />
      </LayoutWrapper>
    </>
  );
}
