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
    <BackgroundEmoji emoji="💥" tiled={true}>
      <LayoutWrapper className="max-w-[600px] pb-16 pt-4">
        <h1 className="nn-title">Something went wrong</h1>
        <p className="nn-text-secondary">Code - {code}</p>
        <p className="mt-4 text-lg">{error}</p>

        <Link
          href="/"
          className="nn-interactive nn-bg-contrast mt-8 inline-block rounded-md px-3 py-2 text-xs font-bold uppercase leading-tight"
        >
          Go home
        </Link>
      </LayoutWrapper>
    </BackgroundEmoji>
  );
}
