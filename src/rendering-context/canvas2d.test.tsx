import images from "../../test/images";
import { recordMethodCalls } from "../../test/mock";
import { NodeCanvas } from "../elements/canvas";
import { NodeImage } from "../elements/image";
import { NodeImageBitmap } from "../imagebitmap";
import { NodeImageData } from "../imagedata";
import { NodeCanvasRenderingContext2D } from "./canvas2d";

const WIDTH = 300;
const HEIGHT = 150;

test("drawImage should call the implementation of the underlying bitmap", () => {
  const [bitmap, bitmapRecord] = recordMethodCalls(new NodeImageBitmap());
  const canvas = new NodeCanvas(bitmap);
  const ctx = new NodeCanvasRenderingContext2D(canvas);
  const image = new NodeImage(images.rawImage4x1);
  ctx.drawImage(image, 0, 0);
  expect(bitmapRecord._drawImage).toHaveBeenCalled();
});

test("getImageData should call the implementation of the underlying bitmap", () => {
  const [bitmap, bitmapRecord] = recordMethodCalls(
    new NodeImageBitmap(images.rawImage4x1)
  );
  const canvas = new NodeCanvas(bitmap);
  const ctx = new NodeCanvasRenderingContext2D(canvas);
  ctx.getImageData(0, 0, 1, 1);
  expect(bitmapRecord._getImageData).toHaveBeenCalled();
});

test("putImageData should call the implementation of the underlying bitmap", () => {
  const [bitmap, bitmapRecord] = recordMethodCalls(new NodeImageBitmap());
  bitmap._resize(1, 1);
  const canvas = new NodeCanvas(bitmap);
  const ctx = new NodeCanvasRenderingContext2D(canvas);
  const idata = new NodeImageData(1, 1);
  ctx.putImageData(idata, 0, 0);
  expect(bitmapRecord._putImageData).toHaveBeenCalled();
});

test("createImageData should return a blank NodeImageData with the given dimensions", () => {
  const canvas = new NodeCanvas();
  const ctx = new NodeCanvasRenderingContext2D(canvas);
  const idata = ctx.createImageData(WIDTH, HEIGHT);
  expect(idata.width).toBe(WIDTH);
  expect(idata.height).toBe(HEIGHT);
  expect(idata.data).toHaveLength(WIDTH * HEIGHT * 4);
});

test("createImageData should return a blank NodeImageData with the dimensions of the provided NodeImageData", () => {
  const canvas = new NodeCanvas();
  const ctx = new NodeCanvasRenderingContext2D(canvas);
  const input = new NodeImageData(WIDTH, HEIGHT);
  const idata = ctx.createImageData(input);
  expect(idata.width).toBe(WIDTH);
  expect(idata.height).toBe(HEIGHT);
  expect(idata.data).not.toBe(input);
});
