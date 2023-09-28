import assert from "node:assert";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { GetFeaturedPopularReturn } from "@nonovel/query";
import { getFeaturedPopular } from "~/lib/server";
import { src, toTitleCase, ec, cn } from "~/lib";
import {
  LayoutWrapper,
  AspectImage,
  SectionHeading,
} from "~/components/shared";
import { BannerText } from "~/components/default";

export function generateMetadata(): Metadata {
  return {
    title: "NoNovel - Escape reality. Read a book.",
  };
}

interface BackgroundImageProps {
  children?: React.ReactNode;
  className?: string;
  src: string;
}

const BackgroundImage = ({
  src,
  children,
  className,
}: BackgroundImageProps) => {
  return (
    <div className="nn-bg-header-image relative">
      {/* Image */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={src}
          priority={true}
          fill={true}
          className="bg-cover object-cover object-center"
          alt="Header Background Image"
        />
      </div>

      {/* Gradient */}
      <div
        className="-z-9 absolute inset-0"
        style={{
          background: `linear-gradient(0deg, var(--nn-fade) 5%, transparent), linear-gradient(180deg, var(--nn-fade) 0%, transparent 30%)`,
        }}
      />

      {/* Children */}
      <div className={cn("z-10 saturate-[1.2] backdrop-blur-[2px]", className)}>
        {children}
      </div>
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
      <BackgroundImage src="/images/home/header-min.jpg">
        <LayoutWrapper className="relative h-screen short:h-32">
          <BannerText className="absolute bottom-32 max-h-[50%] w-3/4 sm:w-2/3 lg:w-1/2 short:invisible" />
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
