import sharp from "sharp";
import { NIRawImage, NodeCanvas, NodeImageBitmap } from "../src";

const LOAD_IMAGE_OPTS = {
  resolveWithObject: true as true
};

export async function loadImage(source: string) {
  const rawImage = (await sharp(source)
    .raw()
    .toBuffer(LOAD_IMAGE_OPTS)) as NIRawImage;
  const bitmap = new NodeImageBitmap(rawImage);
  return bitmap;
}

export async function saveImage(
  target: string,
  rawImage: NIRawImage | NodeImageBitmap | NodeCanvas
) {
  if (rawImage instanceof NodeCanvas) rawImage = rawImage.toRawImage();
  if (rawImage instanceof NodeImageBitmap) rawImage = rawImage._toRawImage();
  const { data, info } = rawImage;
  return await sharp(data, { raw: info })
    .png()
    .toFile(target);
}
