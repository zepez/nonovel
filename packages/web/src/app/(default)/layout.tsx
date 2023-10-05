import { Suspense } from "react";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import PlausibleProvider from "next-plausible";
import { Provider as TextWrapProvider } from "react-wrap-balancer";
import { LayoutDesktopHeader, LayoutMobileHeader } from "~/components/default";
import { LayoutFooter, ThemeProvider, AuthProvider } from "~/components/shared";
import { Toaster } from "~/components/ui/toaster";
import { Skeleton } from "~/components/ui/skeleton";

import "@smastrom/react-rating/style.css";
import "../../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL("https://nonovel.io"),
  title: {
    template: "%s - NoNovel",
    default: "NoNovel",
  },
  description:
    "Escape reality. Read a book. NoNovel offers completely free access to hundreds of books.",
  icons: {
    icon: "/favicon.svg",
  },
  generator: "Next.js",
  applicationName: "NoNovel",
  referrer: "origin-when-cross-origin",
  keywords: ["novels", "books", "fiction", "public domain"],
  category: "books",
  colorScheme: "dark",
  themeColor: "black",
  creator: "Alexander Zepezauer",
  publisher: "NoNovel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: {
      template: "%s - NoNovel",
      default: "NoNovel",
    },
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
      },
    ],
    description: "Read novels online for free.",
    url: "https://nonovel.io",
    siteName: "NoNovel",
    locale: "en_US",
    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PlausibleProvider domain="nonovel.io" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="flex flex-col min-h-screen font-sans">
              <Suspense
                fallback={
                  <Skeleton className="h-[119.5px] w-full rounded-none" />
                }
              >
                <LayoutDesktopHeader />
                <LayoutMobileHeader />
              </Suspense>
              <TextWrapProvider>
                <main className="flex-grow">{children}</main>
              </TextWrapProvider>
              <LayoutFooter />
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
