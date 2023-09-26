import { LayoutWrapper, BackgroundEmoji } from "~/components/shared";

interface UpdatesLayoutProps {
  children: React.ReactNode;
}

export default function UpdatesLayout({ children }: UpdatesLayoutProps) {
  return (
    <>
      <BackgroundEmoji emoji="🎭" tiled={true}>
        <LayoutWrapper className="pb-16 pt-4">
          <h1 className="nn-title">Updates</h1>
          <p className="mt-2">
            Get the scoop on all the new features and important NoNovel site
            announcements.
          </p>
        </LayoutWrapper>
      </BackgroundEmoji>

      <LayoutWrapper>{children}</LayoutWrapper>
    </>
  );
}
