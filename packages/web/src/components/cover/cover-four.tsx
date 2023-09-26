import {
  Watermark,
  Card,
  Structure,
  Background,
} from "~/components/cover/layout";

interface Props {
  background: string;
  title: string;
  author: string;
}

export const CoverFour = ({ background, title, author }: Props) => {
  return (
    <Structure className="cover-custom-border-overlay cover-custom-border-four">
      <Background image={background} />

      <Card
        className="cover-simple-border cover-simple-border-inset top-32 w-[475px]"
        title={title}
        author={author}
      />

      <Watermark className="bottom-10" inferColorColorFrom="bottom" />
    </Structure>
  );
};
