import { Metadata } from "next";
import Link from "next/link";
import { LayoutWrapper, BackgroundEmoji } from "~/components/shared";

interface ErrorPageProps {
  searchParams: {
    error: string;
    code: string;
  };
}

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function ErrorPage({ searchParams }: ErrorPageProps) {
  const { error, code = "Unknown" } = searchParams;

  return (
    <BackgroundEmoji emoji="🔥" tiled={true}>
      <LayoutWrapper className="pb-16 pt-4">
        <h1 className="nn-title pb-1">Error: Unable to Get Resource</h1>
        <p className="nn-detail py-3">
          Code - <code>{code}</code>
        </p>
        <p className="text-lg">{error}</p>

        <Link
          href="/"
          className="nn-interactive bg-nn-base-invert mt-4 inline-block rounded-md px-3 py-2 text-xs font-bold uppercase leading-tight"
        >
          Go home
        </Link>
      </LayoutWrapper>
    </BackgroundEmoji>
  );
}
