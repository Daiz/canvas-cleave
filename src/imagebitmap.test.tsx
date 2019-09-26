import { isSimilar } from "../test/compare";
import images from "../test/images";
import { loadImage } from "../test/io";
import { recordMethodCalls } from "../test/mock";
import { NodeImageBitmap } from "./imagebitmap";

test("constructor should error on bad input", () => {
  const badWidth = {
    width: -1,
    height: 1,
    channels: 2 as const
  };
  const badHeight = {
    width: 1,
    height: -1,
    channels: 2 as const
  };
  const badChannels = {
    width: 1,
    height: 1,
    channels: 5 as const
  };
  const premultiplied = {
    width: 1,
    height: 1,
    channels: 2 as const,
    premultiplied: true
  };
  const badSize = {
    width: 1,
    height: 1,
    channels: 2 as const,
    size: 1
  };
  const valid = {
    width: 1,
    height: 1,
    channels: 2 as const
  };
  const badData = Buffer.from([255]);
  const data = Buffer.from([255, 255]);
  const bigData = Buffer.from([255, 255, 255, 255, 255]);

  expect(() => new NodeImageBitmap({ info: badWidth, data })).toThrow();
  expect(() => new NodeImageBitmap({ info: badHeight, data })).toThrow();
  expect(() => new NodeImageBitmap({ info: valid, data: badData })).toThrow();
  expect(
    // @ts-ignore types don't allow bad channels but test it anyway
    () => new NodeImageBitmap({ info: badChannels, data: bigData })
  ).toThrow();
  expect(() => new NodeImageBitmap({ info: premultiplied, data })).toThrow();
  expect(() => new NodeImageBitmap({ info: badSize, data })).toThrow();
});

test("constructor should accept 1-4 channel input", () => {
  const y8 = new NodeImageBitmap(images.rawImageY8);
  const white = [255, 255, 255];
  const pixel = [255, 192, 128];
  expect(y8._rgbData).toEqual(Uint8ClampedArray.from(white));
  expect(y8._alphaData).toEqual(Uint8ClampedArray.from([255]));
  const y16 = new NodeImageBitmap(images.rawImageY16);
  expect(y16._rgbData).toEqual(Uint8ClampedArray.from(white));
  expect(y16._alphaData).toEqual(Uint8ClampedArray.from([128]));
  const rgb24 = new NodeImageBitmap(images.rawImageRGB24);
  expect(rgb24._rgbData).toEqual(Uint8ClampedArray.from(pixel));
  expect(rgb24._alphaData).toEqual(Uint8ClampedArray.from([255]));
  const rgb32 = new NodeImageBitmap(images.rawImageRGB32);
  expect(rgb32._rgbData).toEqual(Uint8ClampedArray.from(pixel));
  expect(rgb32._alphaData).toEqual(Uint8ClampedArray.from([64]));
});

test("isImageBitmap should return true or false accordingly", () => {
  const bitmap = new NodeImageBitmap();
  const notBitmap = {};
  expect(NodeImageBitmap.isImageBitmap(bitmap)).toBe(true);
  expect(NodeImageBitmap.isImageBitmap(notBitmap)).toBe(false);
});

test("width and height should return width and height", () => {
  const bitmap = new NodeImageBitmap(images.rawImage2x4);
  expect(bitmap.width).toBe(2);
  expect(bitmap.height).toBe(4);
});

test("_hasAlpha should control if the bitmap has an alpha channel", () => {
  const bitmap = new NodeImageBitmap(images.rawImage2x4);
  expect(bitmap._hasAlpha).toBe(false);
  bitmap._hasAlpha = true;
  expect(bitmap._hasAlpha).toBe(true);
});

test("_rgbData and _alphaData should contain the backing TypedArrays", () => {
  const bitmap = new NodeImageBitmap(images.rawImage4x1);
  const rgb = bitmap._rgbData;
  const alpha = bitmap._alphaData;
  expect(rgb).toEqual(Uint8ClampedArray.from(images.rawImage4x1.data));
  expect(alpha).toEqual(Uint8ClampedArray.from([255, 255, 255, 255]));
});

test("_resize should resize the bitmap", () => {
  const bitmap = new NodeImageBitmap();
  expect(bitmap.width).toBe(0);
  expect(bitmap.height).toBe(0);
  bitmap._resize(4, 4);
  expect(bitmap.width).toBe(4);
  expect(bitmap.height).toBe(4);
  bitmap._resize(-1, -1);
  expect(bitmap.width).toBe(0);
  expect(bitmap.height).toBe(0);
});

test("_resize should throw an error on too big size", () => {
  const bitmap = new NodeImageBitmap();
  expect(() => bitmap._resize(2e4, 2e4)).toThrow();
});

test("_resize should be a no-op on equal dimensions", () => {
  const bitmap = new NodeImageBitmap();
  bitmap._resize(2, 2);
  const rgb = bitmap._rgbData;
  bitmap._resize(2, 2);
  expect(rgb).toBe(bitmap._rgbData);
});

test("_resize should zero contents even if data size remains same", () => {
  const bitmap = new NodeImageBitmap(images.rawImage4x1);
  expect(bitmap._getPixel(0, 0)).toEqual(
    Uint8ClampedArray.from([255, 0, 0, 255])
  );
  bitmap._resize(1, 4);
  expect(bitmap._getPixel(0, 0)).toEqual(
    Uint8ClampedArray.from([0, 0, 0, 255])
  );
});

test("_getRGB should return the RGB data at specified coordinates", () => {
  const bitmap = new NodeImageBitmap(images.rawImage4x1);
  // out of bounds
  expect(bitmap._getRGB(-2, -2)).toEqual(Uint8ClampedArray.from([0, 0, 0]));
  // in bounds
  expect(bitmap._getRGB(2, 0)).toEqual(Uint8ClampedArray.from([255, 0, 0]));
});

test("_getAlpha should return the alpha at specified coordinates", () => {
  const bitmap = new NodeImageBitmap(images.rawImage4x1);
  // out of bounds
  expect(bitmap._getAlpha(-2, -2)).toBe(255);
  bitmap._hasAlpha = true;
  expect(bitmap._getAlpha(-2, -2)).toBe(0);
  // in bounds
  expect(bitmap._getAlpha(2, 0)).toBe(255);
});

test("_setRGB should error with invalid length RGB data", () => {
  const bitmap = new NodeImageBitmap(images.rawImage4x1);
  const badRgb = Uint8ClampedArray.from([255, 0]);
  expect(() => bitmap._setRGB(0, 0, badRgb)).toThrow();
});

test("_setRGB should set the RGB data at specified coordinates", () => {
  const bitmap = new NodeImageBitmap(images.rawImage4x1);
  const pixel = [255, 128, 64];
  // out of bounds, does not set from right
  bitmap._setRGB(-1, 0, 0, 0, 0);
  expect(bitmap._getRGB(3, 0)).toEqual(Uint8ClampedArray.from([255, 0, 0]));
  // in bounds
  bitmap._setRGB(0, 0, Uint8ClampedArray.from(pixel));
  expect(bitmap._getRGB(0, 0)).toEqual(Uint8ClampedArray.from(pixel));
  bitmap._setRGB(1, 0, 255, 128, 64);
  expect(bitmap._getRGB(1, 0)).toEqual(Uint8ClampedArray.from(pixel));
});

test("_setAlpha should set the alpha data at specified coordinates", () => {
  const bitmap = new NodeImageBitmap(images.rawImage4x1);
  expect(bitmap._getAlpha(0, 0)).toBe(255);
  // no-op when there's no alpha
  bitmap._setAlpha(0, 0, 64);
  expect(bitmap._getAlpha(0, 0)).toBe(255);
  // or when trying to set out of bounds
  bitmap._hasAlpha = true;
  bitmap._setAlpha(-1, 0, 64);
  expect(bitmap._getAlpha(3, 0)).toBe(255);
  // but works when there's alpha and coordinates are in bounds
  bitmap._setAlpha(1, 0, 64);
  expect(bitmap._getAlpha(1, 0)).toBe(64);
});

test("_drawPixel should error with invalid length RGB data", () => {
  const bitmap = new NodeImageBitmap(images.rawImage4x1);
  const badRgb = Uint8ClampedArray.from([255, 0]);
  expect(() => bitmap._drawPixel(0, 0, badRgb)).toThrow();
});

test("_drawPixel should draw a pixel at specified coordinates", () => {
  const [bitmap, bitmapRecord] = recordMethodCalls(
    new NodeImageBitmap(images.rawImage4x1)
  );
  const pixel = Uint8ClampedArray.from([255, 192, 128]);
  const alpha = 128;
  const result = Uint8ClampedArray.from([255, 96, 64]);
  // out of bounds
  bitmap._drawPixel(-1, 0, pixel);
  expect(bitmap._getRGB(3, 0)).not.toEqual(pixel);
  // skip if alpha = 0
  bitmap._drawPixel(0, 0, pixel, 0);
  expect(bitmapRecord._setRGB).not.toBeCalled();
  // in bounds
  bitmap._drawPixel(0, 0, pixel);
  expect(bitmap._getRGB(0, 0)).toEqual(pixel);
  // with alpha
  bitmap._drawPixel(1, 0, pixel, alpha);
  expect(bitmap._getRGB(1, 0)).toEqual(result);
});

test("_setRow should set a horizontal strip of the bitmap", () => {
  const bitmap = new NodeImageBitmap(images.rawImage2x4);
  const image = new NodeImageBitmap(images.rawImage4x1);

  const red = Uint8ClampedArray.from([255, 0, 0]);
  const black = Uint8ClampedArray.from([0, 0, 0]);
  const alpha = 128;

  // out of destination bounds
  bitmap._setRow(image, 0, 0, 2, 0, 4);

  // out of source bounds
  bitmap._setRow(image, -4, 0, 0, 0, 2);

  // limit row from left
  bitmap._setRow(image, -1, 0, -1, 0, 4);
  expect(bitmap._getRGB(0, 0)).toEqual(red);
  expect(bitmap._getRGB(1, 0)).toEqual(red);

  // limit row from right
  bitmap._setRow(image, 2, 0, 1, 1, 4);
  expect(bitmap._getRGB(0, 1)).toEqual(black);
  expect(bitmap._getRGB(1, 1)).toEqual(red);

  // with alpha
  bitmap._hasAlpha = true;
  image._hasAlpha = true;
  image._setAlpha(0, 0, alpha);
  image._setAlpha(1, 0, alpha);
  bitmap._setRow(image, 0, 0, 0, 2, 2);
  expect(bitmap._getAlpha(0, 2)).toEqual(alpha);
  expect(bitmap._getAlpha(1, 2)).toEqual(alpha);
});

// ----

test("_drawImage should error on negative width / height", () => {
  const bitmap = new NodeImageBitmap(images.rawImage4x1);
  const image = new NodeImageBitmap(images.rawImage2x4);
  expect(() => bitmap._drawImage(image, 0, 0, -2, -4, 0, 0, -2, -4)).toThrow();
});

test("_drawImage should error if trying to resize image", () => {
  const bitmap = new NodeImageBitmap(images.rawImage4x1);
  const image = new NodeImageBitmap(images.rawImage2x4);
  expect(() => bitmap._drawImage(image, 0, 0, 2, 4, 0, 0, 1, 1)).toThrow();
});

test("_drawImage should draw an image at the specified coordinates", async () => {
  const [rb64, gw32, ba32, resultGW, resultBA] = await Promise.all([
    loadImage(images.gradientRedBlack64),
    loadImage(images.gradientGreenWhite32),
    loadImage(images.gradientBlueAlpha32),
    loadImage(images.gradientGWonRBx40y8),
    loadImage(images.gradientBAonRBx4y4)
  ]);

  const [bitmap, bitmapRecord] = recordMethodCalls(new NodeImageBitmap());
  bitmap._resize(64, 64);

  // out of bounds should terminate early
  bitmap._drawImage(gw32, -64, -64);
  expect(bitmapRecord._setRow).not.toHaveBeenCalled();

  // coverage: continue when y < 0, terminate when y >= height
  bitmap._drawImage(gw32, 0, -16);
  bitmap._drawImage(gw32, 0, 48);
  expect(bitmapRecord._setRow).toHaveBeenCalled();
  expect(bitmapRecord._drawPixel).not.toHaveBeenCalled();

  // coverage: with RGB32, continue when x < 0, terminate when x >= width
  bitmap._drawImage(ba32, -16, 0);
  bitmap._drawImage(ba32, 48, 0);
  expect(bitmapRecord._drawPixel).toHaveBeenCalled();

  // RGB24 image drawing
  bitmap._drawImage(rb64, 0, 0);
  bitmap._drawImage(gw32, 40, 8);
  expect(await isSimilar(bitmap, resultGW)).toBe(true);

  // RGB32 image drawing
  bitmap._drawImage(rb64, 0, 0);
  bitmap._drawImage(ba32, 4, 4);
  expect(await isSimilar(bitmap, resultBA, 10)).toBe(true);
});

test("_getPixel returns RGBA pixel data", () => {
  const bitmap = new NodeImageBitmap(images.rawImage4x1);
  const result = Uint8ClampedArray.from([255, 0, 0, 255]);
  const black = Uint8ClampedArray.from([0, 0, 0, 255]);
  const blank = Uint8ClampedArray.from([0, 0, 0, 0]);
  // out of bounds
  expect(bitmap._getPixel(-1, -1)).toEqual(black);
  bitmap._hasAlpha = true;
  expect(bitmap._getPixel(-1, -1)).toEqual(blank);
  // in bounds
  const pixel = bitmap._getPixel(0, 0);
  expect(pixel).toEqual(result);
});

test("_setPixel errors in invalid length RGBA data", () => {
  const bitmap = new NodeImageBitmap(images.rawImage4x1);
  const badRgba = Uint8ClampedArray.from([255, 0, 0]);
  expect(() => bitmap._setPixel(0, 0, badRgba)).toThrow();
});

test("_setPixel sets RGBA pixel data", () => {
  const bitmap = new NodeImageBitmap(images.rawImage4x1);
  const red = Uint8ClampedArray.from([255, 0, 0, 255]);
  const green = Uint8ClampedArray.from([0, 255, 0, 255]);
  const blue = Uint8ClampedArray.from([0, 0, 255, 128]);
  // out of bounds
  bitmap._setPixel(-1, 0, green);
  expect(bitmap._getPixel(3, 0)).toEqual(red);
  // in bounds
  bitmap._setPixel(0, 0, green);
  expect(bitmap._getPixel(0, 0)).toEqual(green);
  // with alpha
  bitmap._hasAlpha = true;
  bitmap._setPixel(1, 0, blue);
  expect(bitmap._getPixel(1, 0)).toEqual(blue);
});

test("_getImageData errors if trying to get zero-sized data", () => {
  const bitmap = new NodeImageBitmap(images.rawImage4x1);
  expect(() => bitmap._getImageData(0, 0, 0, 0)).toThrow();
});

test("_getImageData returns IImageData", () => {
  const bitmap = new NodeImageBitmap(images.rawImage2x4);
  const idata = bitmap._getImageData(0, 0, 2, 1);
  const result = Uint8ClampedArray.from([0, 0, 0, 255, 0, 0, 0, 255]);
  expect(idata.width).toBe(2);
  expect(idata.height).toBe(1);
  expect(idata.data).toEqual(result);
  const idata2 = bitmap._getImageData(1, 2, -1, -2);
  expect(idata2.width).toBe(1);
  expect(idata2.height).toBe(2);
  expect(idata.data).toEqual(result);
});

test("_putImageData errors if any values are Infinity", () => {
  const bitmap = new NodeImageBitmap(images.rawImage2x4);
  const idata = bitmap._getImageData(0, 0, 2, 4);
  expect(() => bitmap._putImageData(idata, Infinity, Infinity)).toThrow();
});

test("_putImageData errors if width / height are negative", () => {
  const bitmap = new NodeImageBitmap(images.rawImage2x4);
  const idata = bitmap._getImageData(0, 0, 2, 4);
  expect(() => bitmap._putImageData(idata, 0, 0, 0, 0, -2, -2)).toThrow();
});

test("_putImageData puts IImageData into the bitmap", async () => {
  const bitmap = new NodeImageBitmap(images.rawImage2x4); // black
  const source = new NodeImageBitmap(images.rawImage4x1); // red
  const red = Uint8ClampedArray.from([255, 0, 0, 255]);
  const data = Uint8ClampedArray.from([0, 0, 0, 255, 0, 0, 0, 255]);
  const idata = source._getImageData(0, 0, 2, 1);
  // out of bounds
  bitmap._putImageData(idata, -2, 0);
  expect(bitmap._getImageData(0, 0, 2, 1).data).toEqual(data);
  // in bounds
  bitmap._putImageData(idata, 0, 0);
  expect(bitmap._getImageData(0, 0, 2, 1).data).toEqual(idata.data);
  // portion
  bitmap._putImageData(idata, 0, 1, 0, 0, 1, 1);
  expect(bitmap._getPixel(1, 0)).toEqual(red);
  const [rb64, gw32, result] = await Promise.all([
    loadImage(images.gradientRedBlack64),
    loadImage(images.gradientGreenWhite32),
    loadImage(images.gradientRedBlack32)
  ]);
  const bdata = rb64._getImageData(0, 0, 64, 64);
  gw32._putImageData(bdata, -16, -16, 0, 0, 64, 64);
  expect(await isSimilar(gw32, result)).toBe(true);
});
