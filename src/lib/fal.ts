import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY,
});

export { fal };
export const HUNYUAN_ENDPOINT = "fal-ai/hunyuan-3d/v3.1/pro/image-to-3d";