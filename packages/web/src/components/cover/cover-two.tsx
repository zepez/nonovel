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

export const CoverTwo = ({ background, title, author }: Props) => {
  return (
    <Structure className="cover-custom-border-overlay cover-svg-overlay-two">
      <Background image={background} />
      <Card
        className="cover-simple-border cover-simple-border-inset top-32 w-[475px]"
        title={title}
        author={author}
      />
      <Watermark className="bottom-12" inferColorColorFrom="bottom" />
    </Structure>
  );
};
