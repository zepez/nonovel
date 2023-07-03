"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { LayoutWrapper, BackgroundEmoji } from "~/components/shared";

const segments = {
  default: {
    title: "Settings",
    description:
      "Your settings will be applied to all of your devices and browsers.",
  },
  account: {
    title: "Account Settings",
    description:
      "Your account details will always remain private and are not publicly displayed.",
  },
  profile: {
    title: "Profile Settings",
    description:
      "Your profile details will be displayed publicly on your profile page.",
  },
};

export const LayoutHeader = () => {
  type Segment = keyof typeof segments;

  const segment = (useSelectedLayoutSegment() as Segment) ?? "default";
  const current = segments[segment] ?? segments.default;

  return (
    <div className="relative overflow-hidden">
      <BackgroundEmoji
        emoji="⚙️"
        className="nn-bg-blurred absolute inset-0 z-0 h-full w-full"
        tiled={false}
      />
      <div className="relative z-10 flex h-64 items-center">
        <LayoutWrapper className="lg:px-16">
          <h1 className="text-2xl font-bold leading-tight">{current.title}</h1>
          <p className="mt-2">{current.description}</p>
        </LayoutWrapper>
      </div>
    </div>
  );
};
