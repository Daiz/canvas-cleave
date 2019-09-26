import { NodeCanvas, NodeDocument } from ".";
import { isSimilar } from "../test/compare";
import { overlay, tileRight } from "../test/draw";
import images from "../test/images";
import { loadImage } from "../test/io";

beforeAll(() => {
  NodeDocument.inject();
});

afterAll(() => {
  NodeDocument.eject();
});

test("tiling redYellow with green should equal redYellowGreen", async () => {
  const [expected, redYellow, green] = await Promise.all([
    loadImage(images.redYellowGreen),
    loadImage(images.redYellow),
    loadImage(images.green)
  ]);

  const received = tileRight([redYellow, green]) as NodeCanvas;

  expect(await isSimilar(expected, received)).toBe(true);
});

test("overlaying sticker on yellowGreen should equal yellowGreenWithSticker", async () => {
  const [expected, yellowGreen, sticker] = await Promise.all([
    loadImage(images.yellowGreenWithSticker),
    loadImage(images.yellowGreen),
    loadImage(images.sticker)
  ]);

  const received = overlay(sticker, yellowGreen, 0, 0) as NodeCanvas;

  expect(await isSimilar(expected, received)).toBe(true);
});

test("tiling green with sticker should equal greenSticker", async () => {
  const [expected, green, sticker] = await Promise.all([
    loadImage(images.greenSticker),
    loadImage(images.green),
    loadImage(images.sticker)
  ]);

  const received = tileRight([green, sticker]) as NodeCanvas;

  expect(await isSimilar(expected, received)).toBe(true);
});
