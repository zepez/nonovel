import {
  StabilityImageGenerationModel,
  generateImage,
  type StabilityImageGenerationStylePreset,
} from "modelfusion";

type PromptImageOptions = { text: string; weight: number }[];

export const aiImage = async (
  style: StabilityImageGenerationStylePreset | null,
  prompt: PromptImageOptions
) => {
  const opts = {
    model: "stable-diffusion-xl-1024-v1-0",
    cfgScale: 7,
    height: 1216,
    width: 832,
    samples: 1,
    steps: 50,
  };

  if (style) Object.assign(opts, { stylePreset: style });

  return await generateImage(new StabilityImageGenerationModel(opts), [
    ...prompt,
    {
      text: "ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face",
      weight: -1,
    },
  ]);
};
