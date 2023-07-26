import { aiImage } from "../medium";

export const promptProjectCoverUnknown = () => {
  return aiImage("tile-texture", [
    {
      text: "beautiful simple mandala, desaturated, clip art",
      weight: 1,
    },
  ]);
};
