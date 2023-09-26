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

export const CoverThree = ({ background, title, author }: Props) => {
  return (
    <Structure>
      <Background image={background} className="cover-simple-border-inset" />
      <Card
        className="cover-custom-border-overlay cover-svg-overlay-three cover-simple-border-inset-2 bottom-16 w-[475px] rounded-sm"
        title={title}
        author={author}
      />
      <Watermark className="top-10" inferColorColorFrom="top" />
    </Structure>
  );
};
