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

export const CoverOne = ({ background, title, author }: Props) => {
  return (
    <Structure className="cover-custom-border-overlay cover-custom-border-one">
      <Background image={background} className="cover-simple-border-inset" />
      <Card
        className="cover-simple-border cover-simple-border-inset top-1/2 w-[475px] -translate-y-1/2 gap-8 py-24"
        title={title}
        author={author}
      />
      <Watermark className="bottom-10" inferColorColorFrom="bottom" />
    </Structure>
  );
};
