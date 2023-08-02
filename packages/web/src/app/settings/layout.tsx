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
      <LayoutWrapper className="col-span-1 mt-8 grid md:mt-0 md:grid-cols-4">
        <LayoutNavigation />
        <div className="nn-bg-foreground col-span-1 mt-6 rounded-b-md pb-8 pt-4 md:col-span-3 md:mt-0">
          {children}
        </div>
      </LayoutWrapper>
    </>
  );
}
