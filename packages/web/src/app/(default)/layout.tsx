import { Suspense } from "react";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { LayoutDesktopHeader, LayoutMobileHeader } from "~/components/default";
import {
  LayoutFooter,
  ThemeProvider,
  AuthProvider,
  Analytics,
} from "~/components/shared";
import { Toaster } from "~/components/ui/toaster";
import { Skeleton } from "~/components/ui/skeleton";

import "@smastrom/react-rating/style.css";
import "../../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://nonovel.io"),
  title: {
    template: "%s | NoNovel",
    default: "NoNovel",
  },
  description: "Read novels online for free.",
  icons: {
    icon: "/favicon.svg",
  },
  generator: "Next.js",
  applicationName: "NoNovel.io",
  referrer: "origin-when-cross-origin",
  keywords: ["novel", "fiction", "story", "public domain"],
  category: "books",
  colorScheme: "dark",
  themeColor: "black",
  creator: "Alexander Zepezauer",
  publisher: "NoNovel.io",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "NoNovel.io",
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
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="flex min-h-screen flex-col">
              <Suspense fallback={<Skeleton className="h-14 w-full" />}>
                <LayoutDesktopHeader />
                <LayoutMobileHeader />
              </Suspense>
              <main className="flex-grow">{children}</main>
              <LayoutFooter />
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
