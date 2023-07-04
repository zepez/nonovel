"use server";

interface CountryCodeEmojiProps {
  code?: string | null;
}

export const CountryCodeEmoji = ({ code }: CountryCodeEmojiProps) => {
  if (!code) return null;

  const emoji = code
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .reduce((a, b) => `${a}${b}`);

  return <>{emoji}</>;
};
