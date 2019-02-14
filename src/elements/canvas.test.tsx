import { recordMethodCalls } from "../../test/mock";
import { NodeImageBitmap } from "../imagebitmap";
import { NodeImageBitmapRenderingContext } from "../rendering-context/bitmap";
import { NodeCanvasRenderingContext2D } from "../rendering-context/canvas2d";
import { NodeCanvas } from "./canvas";

const WIDTH = 300;
const HEIGHT = 150;

test("constructor with no arguments should return a canvas with zero width/height", () => {
  const canvas = new NodeCanvas();
  expect(canvas.width).toBe(0);
  expect(canvas.height).toBe(0);
});

test("constructor with width/height arguments should return a canvas with the given dimensions", () => {
  const canvas = new NodeCanvas(WIDTH, HEIGHT);
  expect(canvas.width).toBe(WIDTH);
  expect(canvas.height).toBe(HEIGHT);
});

test("constructor with a NodeImageBitmap argument should return a canvas initialized with said image bitmap", () => {
  const bitmap = new NodeImageBitmap();
  const canvas = new NodeCanvas(bitmap);
  expect(canvas._getImageBitmap()).toBe(bitmap);
});

test("width/height getters should return the width/height of the underlying NodeImageBitmap", () => {
  const canvas = new NodeCanvas(WIDTH, HEIGHT);
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

test("_getImageBitmap should return the underlying bitmap of the canvas", () => {
  const bitmap = new NodeImageBitmap();
  const canvas = new NodeCanvas(bitmap);
  expect(canvas._getImageBitmap()).toBe(bitmap);
});

test("_setImageBitmap should set the canvas bitmap to the given bitmap", () => {
  const canvas = new NodeCanvas();
  const bitmap = new NodeImageBitmap();
  canvas._setImageBitmap(bitmap);
  expect(canvas._getImageBitmap()).toBe(bitmap);
});

test("toRawImage should call the implementation of the underlying bitmap", () => {
  const [bitmap, bitmapRecord] = recordMethodCalls(new NodeImageBitmap());
  const canvas = new NodeCanvas(bitmap);
  canvas.toRawImage();
  expect(bitmapRecord._toRawImage).toHaveBeenCalled();
});
