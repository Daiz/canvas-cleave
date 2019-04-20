import { NodeImageBitmapRenderingContext } from "../rendering-context/bitmap";
import { NodeCanvasRenderingContext2D } from "../rendering-context/canvas2d";
import {
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
  NodeCanvas
} from "./canvas";

const WIDTH = 300;
const HEIGHT = 150;

test("width/height getters should return the width/height of the underlying NodeImageBitmap", () => {
  const canvas = new NodeCanvas();
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const bitmap = canvas._getImageBitmap();
  expect(canvas.width).toBe(bitmap.width);
  expect(canvas.height).toBe(bitmap.height);
});

test("width/height setters should resize the underlying NodeImageBitmap", () => {
  const canvas = new NodeCanvas();
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  expect(canvas.width).toBe(WIDTH);
  expect(canvas.height).toBe(HEIGHT);
});

test("width/height setters with negative values should use defaults instead", () => {
  const canvas = new NodeCanvas();
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  canvas.width = WIDTH * -1;
  canvas.height = HEIGHT * -1;
  expect(canvas.width).toBe(DEFAULT_CANVAS_WIDTH);
  expect(canvas.height).toBe(DEFAULT_CANVAS_HEIGHT);
});

test("width/height setters with decimal values should be floored", () => {
  const canvas = new NodeCanvas();
  canvas.width = WIDTH + 0.4;
  canvas.height = HEIGHT + 0.8;
  expect(canvas.width).toBe(WIDTH);
  expect(canvas.height).toBe(HEIGHT);
});

test("width/height setters with Infinity should use 0 instead", () => {
  const canvas = new NodeCanvas();
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  canvas.width = Infinity;
  canvas.height = Infinity;
  expect(canvas.width).toBe(0);
  expect(canvas.height).toBe(0);
});

test(`getContext("bitmaprenderer") should return a NodeImageBitmapRenderingContext`, () => {
  const canvas = new NodeCanvas();
  const ctx = canvas.getContext("bitmaprenderer");
  expect(ctx).toBeInstanceOf(NodeImageBitmapRenderingContext);
});

test(`getContext("2d") should return a NodeCanvasRenderingContext2D`, () => {
  const canvas = new NodeCanvas();
  const ctx = canvas.getContext("2d");
  expect(ctx).toBeInstanceOf(NodeCanvasRenderingContext2D);
});

test(`getContext("2d", { alpha: false }) should make the underlying canvas bitmap disable the alpha channel`, () => {
  const canvas = new NodeCanvas();
  const bitmap = canvas._getImageBitmap();
  expect(bitmap._hasAlpha).toBe(true);
  canvas.getContext("2d", { alpha: false });
  expect(bitmap._hasAlpha).toBe(false);
});

test(`getContext("2d", { alpha: true }) should make the underlying canvas bitmap enable the alpha channel`, () => {
  const canvas = new NodeCanvas();
  const bitmap = canvas._getImageBitmap();
  bitmap._hasAlpha = false;
  expect(bitmap._hasAlpha).toBe(false);
  canvas.getContext("2d", { alpha: true });
  expect(bitmap._hasAlpha).toBe(true);
});
