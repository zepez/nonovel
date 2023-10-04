import assert from "node:assert";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
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
  wrapperClassName: string;
  imageClassName?: string;
  backgroundStyle: { [key: string]: string };
  src: string;
}

const BackgroundImage = ({
  src,
  children,
  className,
  wrapperClassName,
  imageClassName,
  backgroundStyle,
}: BackgroundImageProps) => {
  return (
    <div className={cn(wrapperClassName, "relative")}>
      {/* Image */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={src}
          priority={true}
          fill={true}
          className={cn(
            "bg-cover object-cover object-center saturate-[1.2]",
            imageClassName
          )}
          alt="Header Background Image"
        />
      </div>

      {/* Gradient */}
      <div className="absolute inset-0 -z-10" style={backgroundStyle} />

      {/* Children */}
      <div className={cn("z-10 backdrop-blur-[2px]", className)}>
        {children}
      </div>
    </div>
  );
};

interface CoverGridProps {
  projects: NonNullable<GetFeaturedPopularReturn[1]>;
  className?: string;
  moreLink: string;
}

const CoverGrid = async ({ projects, className, moreLink }: CoverGridProps) => {
  const lastProject = projects[projects.length - 1];

  return (
    <div className={cn("flex flex-wrap gap-y-8", className)}>
      {projects.map((project) => (
        <Link
          href={`/read/${project.slug}`}
          key={project.id}
          className="nn-interactive block h-auto w-1/2 px-1 sm:w-1/3 md:w-1/4 md:px-2 lg:w-1/5"
        >
          <AspectImage
            src={src(project.cover)}
            alt={project.name}
            width={300}
            className="mb-3"
          />
          <p className="truncate text-lg font-bold">
            {toTitleCase(project.name)}
          </p>
          <p className="truncate">
            {toTitleCase(project.penName ?? "Unknown Author")}
          </p>
        </Link>
      ))}
      <Link
        href={moreLink}
        className="nn-interactive block w-1/2 px-1 pb-16 sm:w-1/3 md:w-1/4 md:px-2 lg:hidden lg:w-1/5"
      >
        <div className="relative h-full w-full">
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-md">
            <AspectImage
              src={src(lastProject.cover)}
              alt={lastProject.name}
              width={300}
              className="mb-3"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center rounded-md backdrop-blur-[30px] backdrop-brightness-90">
            <svg
              className="h-full w-full"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 100 50"
            >
              <foreignObject width="100" height="50">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-lg font-bold uppercase">
                    <p className="m-0 -my-1">View</p>
                    <p className="m-0 -my-1">More</p>
                  </div>
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default async function HomePage() {
  const [popularError, popular] = await getFeaturedPopular({
    period: "all",
    limit: 5,
  });

  const [recentError, recent] = await getFeaturedRecent({ limit: 5 });

  ec(popularError, recentError);
  assert.ok(popular?.length, "No popular projects found");
  assert.ok(recent?.length, "No recent projects found");

  return (
    <>
      <BackgroundImage
        src="/images/home/header-min.webp"
        wrapperClassName="nn-bg-header-image"
        backgroundStyle={{
          background:
            "linear-gradient(0deg, var(--nn-fade) 5%, transparent), linear-gradient(180deg, var(--nn-fade) 0%, transparent 30%)",
        }}
      >
        <LayoutWrapper className="relative h-screen short:h-32">
          <BannerText className="absolute bottom-32 max-h-[50%] w-3/4 sm:w-2/3 lg:w-1/2 short:invisible" />
        </LayoutWrapper>
      </BackgroundImage>
      <LayoutWrapper className="-mt-24 pb-16 md:pb-24">
        <Balancer
          as="h1"
          className="font-serif text-6xl dark:text-nn-gold-dark md:text-7xl"
        >
          Unlocking the classics
        </Balancer>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Balancer
            as="h2"
            className="pt-2 text-xl font-bold md:pt-4 md:text-2xl"
          >
            Explore timeless treasures of literature, completely free.
          </Balancer>
          <Link
            href="/browse"
            className="nn-interactive bg-nn-accent mt-4 rounded-md px-4 py-2 text-xs font-bold uppercase"
          >
            Start Reading Now
          </Link>
        </div>
      </LayoutWrapper>
      <LayoutWrapper className="pb-20">
        <SectionHeading className="mt-0">Popular Books</SectionHeading>
        <CoverGrid projects={popular} moreLink="/browse" />

        <SectionHeading className="mt-14">Recently Added</SectionHeading>
        <CoverGrid projects={recent} moreLink="/browse?sort=recent" />
      </LayoutWrapper>
      <BackgroundImage
        src="/images/home/bottom-min.jpg"
        wrapperClassName="nn-bg-footer-image -mt-64"
        className="-mb-10 mt-16 pb-44 pt-20 backdrop-blur-0 lg:mb-0 lg:pb-48 lg:pt-36"
        imageClassName="blur-[30px]"
        backgroundStyle={{
          background:
            "linear-gradient(180deg, var(--nn-fade) 5%, transparent 100%)",
        }}
      >
        <LayoutWrapper className="flex flex-wrap justify-center gap-x-12 gap-y-6 lg:flex-nowrap lg:justify-between">
          <Image
            src="/images/home/bottom-min.jpg"
            alt="Image of a library"
            width={600}
            height={200}
            className="h-[250px] flex-grow rounded-md object-cover object-center lg:min-w-[500px]"
          />
          <div className="flex flex-col">
            <Balancer
              as="h4"
              className="font-serif text-5xl dark:text-nn-gold-dark"
            >
              Create your own library
            </Balancer>
            <Balancer as="h5" className="pt-2 text-2xl font-bold">
              Read classic novels with ease.
            </Balancer>
            <p className="flex-grow pb-6 pt-4">
              Delve into classic novels that have inspired generations. Start
              building your collection and enjoy the literary journey!
            </p>
            <div className="mb-2">
              <Link
                href="/browse"
                className="nn-interactive bg-nn-accent rounded-md px-4 py-2 text-xs font-bold uppercase"
              >
                View all books
              </Link>
            </div>
          </div>
        </LayoutWrapper>
      </BackgroundImage>
    </>
  );
}
