import { cn } from "~/lib/utils";

interface BackgroundEmojiProps {
  children?: React.ReactNode;
  className?: string;
  emoji: string;
  tiled?: boolean;
}

export const BackgroundEmoji = ({
  emoji,
  children,
  className,
  tiled = false,
}: BackgroundEmojiProps) => {
  const utf16Emoji = unescape(encodeURIComponent(emoji));
  const svgEmoji = `
    <svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>
      <text y='.9em' font-size='90'>
        ${utf16Emoji}
      </text>
    </svg>
  `;

  return (
    <div className="relative">
      <div
        className={cn(
          "nn-bg-blurred absolute inset-0 z-0",
          tiled ? "bg-repeat" : "bg-cover"
        )}
        style={{
          backgroundImage: `linear-gradient(0deg, var(--nn-fade) 0%, transparent), url("data:image/svg+xml;base64,${btoa(
            svgEmoji
          )}")`,
        }}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
