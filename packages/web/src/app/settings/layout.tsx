import { LayoutWrapper } from "~/components/shared";
import { LayoutNavigation } from "~/components/settings";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutWrapper className="col-span-1 mt-4 grid gap-4 md:grid-cols-4">
      <LayoutNavigation />
      <div className="nn-bg-foreground col-span-1 rounded-md pb-8 pt-4 md:col-span-3">
        {children}
      </div>
    </LayoutWrapper>
  );
}
