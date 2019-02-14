import sharp from "sharp";
import { NIRawImage, NodeCanvas, NodeImageBitmap } from "../../src";

async function dHash(source: NIRawImage) {
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

export async function isSimilar(
  expected: NIRawImage | NodeCanvas | NodeImageBitmap,
  received: NIRawImage | NodeCanvas | NodeImageBitmap,
  threshold: number = 5
) {
  if (expected instanceof NodeCanvas) expected = expected.toRawImage();
  if (expected instanceof NodeImageBitmap) expected = expected._toRawImage();
  if (received instanceof NodeCanvas) received = received.toRawImage();
  if (received instanceof NodeImageBitmap) received = received._toRawImage();
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
