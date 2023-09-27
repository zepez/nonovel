import { Metadata } from "next";
import { Update } from "~/components/updates";

export function generateMetadata(): Metadata {
  return {
    title: "Platform Updates",
    description: "Stay up to date with the latest NoNovel.io updates.",
  };
}

export default function UpdatesLayout() {
  return (
    <section className="space-y-12">
      <Update date="26.09.2023" emoji="🎨" title="New Design">
        <p>
          We got a new coat of paint! More improvements and adjustments are
          coming soon.
        </p>
      </Update>
      <Update date="22.07.2023" emoji="🎉" title="Official Launch">
        <p>NoNovel.io is now LIVE and ready for your reading pleasure.</p>
      </Update>
    </section>
  );
}
