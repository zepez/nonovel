import { Metadata } from "next";
import { LayoutWrapper } from "~/components/shared";
import { LayoutNavigation, LayoutHeader } from "~/components/settings";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <LayoutHeader />
      <LayoutWrapper className="nn-bg-foreground nn-border-50 col-span-1 mb-16 grid gap-12 border-b border-l border-r md:grid-cols-4 md:rounded-b-md">
        <LayoutNavigation />
        <div className="col-span-1 md:col-span-3">{children}</div>
      </LayoutWrapper>
    </>
  );
}
