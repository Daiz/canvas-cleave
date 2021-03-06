import images from "../test/images";
import { recordMethodCalls } from "../test/mock";
import { NodeImageBitmap } from "./imagebitmap";
import { NodeImageBitmapConsumer } from "./imagebitmapconsumer";

class TestConsumer extends NodeImageBitmapConsumer {}

test("constructor with no arguments should return a consumer with 0x0 underlying bitmap", () => {
  const test = new TestConsumer();
  const bitmap = test._getImageBitmap();
  expect(bitmap.width).toBe(0);
  expect(bitmap.height).toBe(0);
});

test("constructor with a NodeImageBitmap argument should return a consumer initialized with the given bitmap", () => {
  const bitmap = new NodeImageBitmap();
  const canvas = new TestConsumer(bitmap);
  expect(canvas._getImageBitmap()).toBe(bitmap);
});

test("constructor with a NIRawImage argument should return a consumer initialized with a bitmap from the raw image data", () => {
  const test = new TestConsumer(images.rawImage4x1);
  const bitmap = test._getImageBitmap();
  expect(bitmap.width).toBe(4);
  expect(bitmap.height).toBe(1);
  expect(bitmap._hasAlpha).toBe(false);
});

test("_getImageBitmap should return the underlying bitmap of the consumer", () => {
  const bitmap = new NodeImageBitmap();
  const test = new TestConsumer(bitmap);
  expect(test._getImageBitmap()).toBe(bitmap);
});

test("_setImageBitmap should set the consumer bitmap to the given bitmap", () => {
  const test = new TestConsumer();
  const bitmap = new NodeImageBitmap();
  test._setImageBitmap(bitmap);
  expect(test._getImageBitmap()).toBe(bitmap);
});

test("toRawImage should call the implementation of the underlying bitmap", () => {
  const [bitmap, bitmapRecord] = recordMethodCalls(new NodeImageBitmap());
  const test = new TestConsumer(bitmap);
  test.toRawImage();
  expect(bitmapRecord.toRawImage).toHaveBeenCalled();
});
