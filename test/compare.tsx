import sharp from "sharp";
import { NIRawImage, NodeCanvas, NodeImageBitmap } from "../src";

async function dHash(source: NIRawImage): Promise<number[]> {
  const buf = await sharp(source.data, { raw: source.info })
    .greyscale()
    .normalize()
    .resize(9, 8, { fit: "fill" })
    .raw()
    .toBuffer();
  let hash: number[] = [];
  for (let y = 0; y < 8; ++y) {
    for (let x = 0; x < 8; ++x) {
      const leftPx = buf[y * 8 + x];
      const rightPx = buf[y * 8 + x + 1];
      hash.push(Number(leftPx < rightPx));
    }
  }
  return hash;
}

export function isRawImage(input: any): input is NIRawImage {
  if (
    input.info &&
    typeof input.info.width === "number" &&
    typeof input.info.height === "number" &&
    typeof input.info.channels === "number" &&
    input.data instanceof Buffer &&
    input.data.length ===
      input.info.width * input.info.height * input.info.channels
  )
    return true;
  return false;
}

export async function isSimilar(
  expected: NIRawImage | NodeCanvas | NodeImageBitmap,
  received: NIRawImage | NodeCanvas | NodeImageBitmap,
  threshold: number = 5
): Promise<boolean> {
  if (!isRawImage(expected)) expected = expected.toRawImage();
  if (!isRawImage(received)) received = received.toRawImage();
  const expectedHash = await dHash(expected);
  const receivedHash = await dHash(received);

  let distance = 0;
  for (let i = 0; i < 64; ++i) {
    if (expectedHash[i] !== receivedHash[i]) {
      ++distance;
    }
  }
  return distance <= threshold;
}
