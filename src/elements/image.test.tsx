import { NodeImageBitmap } from "../imagebitmap";
import { NodeImage } from "./image";

const WIDTH = 300;
const HEIGHT = 150;

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

test("NodeImage.width/height should return their set values", () => {
  const image = new NodeImage();
  image.width = WIDTH;
  image.height = HEIGHT;
  expect(image.width).toBe(WIDTH);
  expect(image.height).toBe(HEIGHT);
});

test("NodeImage.width/height should return a calculated aspect ratio -based value if only the other property is set", () => {
  const bitmap = new NodeImageBitmap();
  bitmap._resize(WIDTH, HEIGHT);
  const image = new NodeImage(bitmap);
  image.width = WIDTH * 2;
  expect(image.height).toBe(HEIGHT * 2);
  image.removeAttribute("width");
  image.height = HEIGHT * 2;
  expect(image.width).toBe(WIDTH * 2);
});

test("NodeImage.width/height should be set to 0 with invalid input values (negative values, NaN, Infinity)", () => {
  const bitmap = new NodeImageBitmap();
  bitmap._resize(WIDTH, HEIGHT);
  const image = new NodeImage(bitmap);
  image.width = -1;
  image.height = -1;
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

test("NodeImage.width/height should always be set to integer values", () => {
  const bitmap = new NodeImageBitmap();
  bitmap._resize(WIDTH, HEIGHT);
  const image = new NodeImage(bitmap);
  image.width = WIDTH + 0.75;
  image.height = HEIGHT + 0.75;
  expect(image.width).toBe(WIDTH);
  expect(image.height).toBe(HEIGHT);
});

test("NodeImage.naturalWidth/naturalHeight should return the width/height of the underlying bitmap", () => {
  const bitmap = new NodeImageBitmap();
  bitmap._resize(WIDTH, HEIGHT);
  const image = new NodeImage(bitmap);
  image.width = WIDTH * 2;
  image.height = HEIGHT * 2;
  expect(image.naturalWidth).toBe(bitmap.width);
  expect(image.naturalHeight).toBe(bitmap.height);
});

test("NodeImage.removeAttribute should remove set width/height attributes", () => {
  const bitmap = new NodeImageBitmap();
  bitmap._resize(WIDTH, HEIGHT);
  const image = new NodeImage(bitmap);
  image.width = 0;
  image.height = 0;
  image.removeAttribute("width");
  image.removeAttribute("height");
  expect(image.width).toBe(WIDTH);
  expect(image.height).toBe(HEIGHT);
});
