import sharp from "sharp";
import { NIRawImage, NodeCanvas, NodeImageBitmap } from "../src";
import { isRawImage } from "./compare";

const LOAD_IMAGE_OPTS = {
  resolveWithObject: true as true
};

export async function loadImage(source: string): Promise<NodeImageBitmap> {
  const rawImage = (await sharp(source)
    .raw()
    .toBuffer(LOAD_IMAGE_OPTS)) as NIRawImage;
  const bitmap = new NodeImageBitmap(rawImage);
  return bitmap;
}

export async function saveImage(
  target: string,
  rawImage: NIRawImage | NodeImageBitmap | NodeCanvas
): Promise<sharp.OutputInfo> {
  if (!isRawImage(rawImage)) rawImage = rawImage.toRawImage();
  const { data, info } = rawImage;
  return await sharp(data, { raw: info })
    .png()
    .toFile(target);
}
