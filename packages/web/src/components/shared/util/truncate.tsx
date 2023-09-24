"use client";

import { useState } from "react";

export const TruncateParagraph = ({
  text = "",
  length,
}: {
  text: string | null;
  length: number;
}) => {
  const [show, setShow] = useState((text?.length ?? 0) < length);

  if (!text) return null;

  return (
    <>
      <p className="inline pr-1">
        {text.substring(0, show ? text.length : length).trim()}
        {!show && "..."}
      </p>
      {!show && (
        <button
          className="inline underline"
          title="Show more"
          onClick={() => setShow(true)}
        >
          Show more
        </button>
      )}
    </>
  );
};
