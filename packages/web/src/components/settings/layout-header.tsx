"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { LayoutWrapper, BackgroundEmoji } from "~/components/shared";

const segments = {
  default: {
    title: "Settings",
    description:
      "Your settings will be applied to all of your devices and browsers.",
    emoji: "⚙️",
  },
  account: {
    title: "Account Settings",
    description:
      "Your account details will always remain private and are not publicly displayed.",
    emoji: "⚙️",
  },
  profile: {
    title: "Profile Settings",
    description:
      "Your profile details will be displayed publicly on your profile page.",
    emoji: "👨🏼‍🎨",
  },
};

export const LayoutHeader = () => {
  type Segment = keyof typeof segments;

  const segment = (useSelectedLayoutSegment() as Segment) ?? "default";
  const current = segments[segment] ?? segments.default;

  return (
    <BackgroundEmoji emoji={current.emoji} tiled={true}>
      <LayoutWrapper className="py-16">
        <h1 className="nn-title text-2xl font-bold">{current.title}</h1>
        <p className="mt-2">{current.description}</p>
      </LayoutWrapper>
    </BackgroundEmoji>
  );
};
