"use client";

import { useMeasure } from "react-use";

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

export const CoverSix = ({ background, title, author }: Props) => {
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  return (
    <Structure>
      <Background image={background} />
      <Card
        className="cover-simple-border cover-simple-border-inset left-4 right-4 top-4 transform-none gap-1 py-6"
        title={title}
        author={author}
        ref={ref}
      />
      <div
        // height + padding + margin + top
        style={{ top: height + 48 + 4 + 16 }}
        className="cover-custom-border-overlay cover-custom-border-six absolute bottom-2 left-2 right-2"
      />
      <Watermark className="bottom-14" inferColorColorFrom="bottom" />
    </Structure>
  );
};
