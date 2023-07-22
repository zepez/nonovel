import { Update } from "~/components/updates";

export default function UpdatesLayout() {
  return (
    <section className="space-y-12">
      <Update date="22.07.2023" emoji="🎉" title="Offical Launch">
        <p>
          Hey bookworms, guess what just hit the digital shelves? That&apos;s
          right, NoNovel.io is now LIVE and ready for your reading pleasure!
          Grab a cup of coffee, pick your coziest nook, and get ready to dive
          into your favorite classics, all in one place.
        </p>
      </Update>
    </section>
  );
}
