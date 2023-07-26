import { aiImage } from "../medium";

export const promptProjectCoverUnknown = () => {
  return aiImage("tile-texture", [
    {
      text: "acanthus pattern, dark, black and gray",
      weight: 1,
    },
  ]);
};
