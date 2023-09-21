import {
  StabilityImageGenerationModel,
  generateImage,
  type StabilityImageGenerationStylePreset,
} from "modelfusion";

type PromptImageOptions = { text: string; weight: number }[];

export const aiImage = async (
  style: StabilityImageGenerationStylePreset,
  prompt: PromptImageOptions
) => {
  return await generateImage(
    new StabilityImageGenerationModel({
      model: "stable-diffusion-xl-beta-v2-2-2",
      cfgScale: 7,
      stylePreset: style,
      height: 512,
      width: 512,
      samples: 1,
      steps: 50,
    }),
    [
      ...prompt,
      {
        text: "ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face",
        weight: -1,
      },
    ]
  );
};
