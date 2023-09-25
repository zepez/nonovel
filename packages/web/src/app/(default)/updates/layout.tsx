import { LayoutWrapper, BackgroundEmoji } from "~/components/shared";

interface UpdatesLayoutProps {
  children: React.ReactNode;
}

export default function UpdatesLayout({ children }: UpdatesLayoutProps) {
  return (
    <>
      <BackgroundEmoji emoji="🎭" tiled={true}>
        <LayoutWrapper className="pb-16 pt-4">
          <h1 className="nn-title text-2xl font-bold">Updates</h1>
          <p className="mt-2">
            Get the scoop on all the fresh features and important announcements
            shaking things up at NoNovel.io.
          </p>
        </LayoutWrapper>
      </BackgroundEmoji>

      <LayoutWrapper>{children}</LayoutWrapper>
    </>
  );
}
