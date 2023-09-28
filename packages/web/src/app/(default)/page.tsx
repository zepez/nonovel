import assert from "node:assert";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { GetFeaturedPopularReturn } from "@nonovel/query";
import { getFeaturedPopular, getFeaturedRecent } from "~/lib/server";
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
  projects: NonNullable<GetFeaturedPopularReturn[1]>;
  className?: string;
}

const CoverGrid = async ({ projects, className }: CoverGridProps) => {
  return (
    <div className={cn("grid grid-cols-12 gap-y-8", className)}>
      {projects.map((project) => (
        <Link
          href={`/p/${project.slug}`}
          key={project.id}
          className="nn-interactive col-span-6 block h-auto px-2 sm:col-span-4 md:col-span-3 lg:col-span-2"
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
  );
};

export default async function HomePage() {
  const [popularError, popular] = await getFeaturedPopular({
    period: "all",
    limit: 6,
  });

  const [recentError, recent] = await getFeaturedRecent({ limit: 6 });

  ec(popularError, recentError);
  assert.ok(popular?.length, "No popular projects found");
  assert.ok(recent?.length, "No recent projects found");

  return (
    <>
      <BackgroundImage src="/images/home/header-min.jpg">
        <LayoutWrapper className="relative h-screen short:h-32">
          <BannerText className="absolute bottom-32 max-h-[50%] w-3/4 sm:w-2/3 lg:w-1/2 short:invisible" />
        </LayoutWrapper>
      </BackgroundImage>
      <LayoutWrapper className="-mt-28">
        <SectionHeading className="mt-0">Popular Books</SectionHeading>
        <CoverGrid projects={popular} />

        <SectionHeading className="mt-14">Recently Added</SectionHeading>
        <CoverGrid projects={recent} />
      </LayoutWrapper>
    </>
  );
}
