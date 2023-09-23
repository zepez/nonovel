import { cn } from "~/lib/utils";

interface BackgroundEmojiProps {
  className?: string;
  emoji: string;
  tiled?: boolean;
}

export const BackgroundEmoji = ({
  className,
  emoji,
  tiled = false,
}: BackgroundEmojiProps) => {
  const utf16Emoji = unescape(encodeURIComponent(emoji));

  return (
    <div
      className={cn(className, "h-64 w-auto", tiled ? "bg-repeat" : "bg-cover")}
      style={{
        backgroundImage: `linear-gradient(0deg, var(--nn-fade) 25%, transparent), url("data:image/svg+xml;base64,${btoa(
          "<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><text y='.9em' font-size='90'>" +
            utf16Emoji +
            "</text></svg>"
        )}`,
      }}
    />
  );
};
