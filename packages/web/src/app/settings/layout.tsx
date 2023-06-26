import { headers } from "next/headers";

import { LayoutWrapper } from "~/components/shared";
import { LayoutNavigation } from "~/components/settings";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const url = headers().get("x-url") || "";
  const segment = url.split("/").splice(3).join("/");

  return (
    <LayoutWrapper className="mt-4 grid grid-cols-4 gap-4">
      <LayoutNavigation segment={segment} />
      <div className="background col-span-3 rounded-md pb-4">{children}</div>
    </LayoutWrapper>
  );
}
