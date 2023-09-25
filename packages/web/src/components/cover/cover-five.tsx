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

export const CoverFive = ({ background, title, author }: Props) => {
  return (
    <Structure className="cover-custom-border-overlay cover-custom-border-five">
      <Background image={background} />
      <Card
        className="cover-simple-border cover-simple-border-inset bottom-16 w-[475px]"
        title={title}
        author={author}
      ></Card>
      <Watermark className="top-10" />
    </Structure>
  );
};
