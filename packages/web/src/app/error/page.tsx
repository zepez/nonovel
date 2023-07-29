import Link from "next/link";
import { LayoutWrapper, BackgroundEmoji } from "~/components/shared";

interface ErrorPageProps {
  searchParams: {
    error: string;
    code: string;
  };
}

export default function ErrorPage({ searchParams }: ErrorPageProps) {
  const { error, code = "Unknown" } = searchParams;

  return (
    <main>
      <div className="relative overflow-hidden">
        <BackgroundEmoji
          emoji="💥"
          className="absolute inset-0 z-0 w-full h-full nn-bg-blurred"
          tiled={false}
        />
        <div className="relative z-10 flex items-center justify-center h-96">
          <LayoutWrapper className="max-w-[600px]">
            <h1 className="text-4xl font-bold leading-tight uppercase">
              Something went wrong
            </h1>
            <p className="nn-text-secondary">Code - {code}</p>
            <p className="mt-4 text-lg">{error}</p>

            <Link
              href="/"
              className="inline-block px-3 py-2 mt-8 text-xs font-bold leading-tight uppercase rounded-md nn-interactive nn-bg-contrast"
            >
              Go home
            </Link>
          </LayoutWrapper>
        </div>
      </div>
    </main>
  );
}
