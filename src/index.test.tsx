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
  const expected = await loadImage(images.redYellowGreen);

  const redYellow = await loadImage(images.redYellow);
  const green = await loadImage(images.green);

  const received = tileRight([redYellow, green]) as NodeCanvas;

  expect(await isSimilar(expected, received)).toBe(true);
});

test("overlaying sticker on yellowGreen should equal yellowGreenWithSticker", async () => {
  const expected = await loadImage(images.yellowGreenWithSticker);

  const yellowGreen = await loadImage(images.yellowGreen);
  const sticker = await loadImage(images.sticker);

  const received = overlay(sticker, yellowGreen, 0, 0) as NodeCanvas;

  expect(await isSimilar(expected, received)).toBe(true);
});

test("tiling green with sticker should equal greenSticker", async () => {
  const expected = await loadImage(images.greenSticker);

  const green = await loadImage(images.green);
  const sticker = await loadImage(images.sticker);

  const received = tileRight([green, sticker]) as NodeCanvas;

  expect(await isSimilar(expected, received)).toBe(true);
});
