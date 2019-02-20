import { NIRawImage, NodeImageBitmap } from "../imagebitmap";
import { NodeImage } from "./image";

const WIDTH = 300;
const HEIGHT = 150;

test("constructor with no arguments should return an image with zero width/height", () => {
  const image = new NodeImage();
  expect(image.width).toBe(0);
  expect(image.height).toBe(0);
});

test("constructor with a NodeImageBitmap argument should return an image initialized with the given bitmap", () => {
  const bitmap = new NodeImageBitmap();
  const image = new NodeImage(bitmap);
  expect(image._getImageBitmap()).toBe(bitmap);
});

test("constructor with a NIRawImage argument should return an image initialized with a bitmap created with the given NIRawImage", () => {
  const rawImage: NIRawImage = {
    info: {
      format: "raw",
      channels: 3,
      width: 1,
      height: 1,
      premultiplied: false,
      size: 3
    },
    data: Buffer.alloc(3)
  };
  const image = new NodeImage(rawImage);
  expect(image.width).toBe(1);
  expect(image.height).toBe(1);
  expect(image._getImageBitmap()._hasAlpha).toBe(false);
});

test("NodeImage.complete should be true", () => {
  const image = new NodeImage();
  expect(image.complete).toBe(true);
});

test("NodeImage._aspectRatio should return the image aspect ratio", () => {
  const bitmap = new NodeImageBitmap();
  bitmap._resize(WIDTH, HEIGHT);
  const image = new NodeImage(bitmap);
  expect(image._aspectRatio).toBe(WIDTH / HEIGHT);
});

test("NodeImage.width/height should return the width/height of the underlying bitmap if unset", () => {
  const bitmap = new NodeImageBitmap();
  bitmap._resize(WIDTH, HEIGHT);
  const image = new NodeImage(bitmap);
  expect(image.width).toBe(bitmap.width);
  expect(image.height).toBe(bitmap.height);
});

test("NodeImage.width/height should return their own values if set", () => {
  const image = new NodeImage();
  image.width = WIDTH;
  image.height = HEIGHT;
  expect(image.width).toBe(WIDTH);
  expect(image.height).toBe(HEIGHT);
});

test("NodeImage.width/height should be set to 0 if called with negative values, NaN or Infinity", () => {
  const image = new NodeImage();
  image.width = -Infinity;
  image.height = -Infinity;
  expect(image.width).toBe(0);
  expect(image.height).toBe(0);
  image.width = NaN;
  image.height = NaN;
  expect(image.width).toBe(0);
  expect(image.height).toBe(0);
  image.width = Infinity;
  image.height = Infinity;
  expect(image.width).toBe(0);
  expect(image.height).toBe(0);
});

test("NodeImage.naturalWidth/naturalHeight should always return the underlying bitmap width/height, regardless of what NodeImage.width/height are set to", () => {
  const bitmap = new NodeImageBitmap();
  bitmap._resize(WIDTH, HEIGHT);
  const image = new NodeImage(bitmap);
  image.width = HEIGHT;
  image.height = WIDTH;
  expect(image.naturalWidth).toBe(WIDTH);
  expect(image.naturalHeight).toBe(HEIGHT);
});
