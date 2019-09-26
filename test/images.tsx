import { resolve } from "path";
import { NIRawImage } from "../src";

const rawImage4x1: NIRawImage = {
  info: {
    width: 4,
    height: 1,
    channels: 3
  },
  data: Buffer.from([255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0])
};

const rawImage2x4: NIRawImage = {
  info: {
    width: 2,
    height: 4,
    channels: 3
  },
  // prettier-ignore
  data: Buffer.from([
    0, 0, 0,   0, 0, 0,
    0, 0, 0,   0, 0, 0,
    0, 0, 0,   0, 0, 0,
    0, 0, 0,   0, 0, 0
  ])
};

const rawImageY8: NIRawImage = {
  info: {
    width: 1,
    height: 1,
    channels: 1
  },
  data: Buffer.from([255])
};

const rawImageY16: NIRawImage = {
  info: {
    width: 1,
    height: 1,
    channels: 2
  },
  data: Buffer.from([255, 128])
};

const rawImageRGB24: NIRawImage = {
  info: {
    width: 1,
    height: 1,
    channels: 3
  },
  data: Buffer.from([255, 192, 128])
};

const rawImageRGB32: NIRawImage = {
  info: {
    width: 1,
    height: 1,
    channels: 4
  },
  data: Buffer.from([255, 192, 128, 64])
};

const images = {
  redYellow: resolve(__dirname, "images/red-yellow.png"),
  redYellowGreen: resolve(__dirname, "images/red-yellow-green.png"),
  yellowGreen: resolve(__dirname, "images/yellow-green.png"),
  green: resolve(__dirname, "images/green.png"),
  greenSticker: resolve(__dirname, "images/green-sticker.png"),
  sticker: resolve(__dirname, "images/sticker.png"),
  yellowGreenWithSticker: resolve(__dirname, "images/yellow-green+sticker.png"),
  gradientRedBlack64: resolve(__dirname, "images/grad-rb-64.png"),
  gradientRedBlack32: resolve(__dirname, "images/grad-rb-32.png"),
  gradientGreenWhite32: resolve(__dirname, "images/grad-gw-32.png"),
  gradientBlueAlpha32: resolve(__dirname, "images/grad-ba-32.png"),
  gradientGWonRBx40y8: resolve(__dirname, "images/grad-mix-40-8.png"),
  gradientGWonRBx_4y_4: resolve(__dirname, "images/grad-mix--4--4.png"),
  gradientBAonRBx4y4: resolve(__dirname, "images/grad-mix-4-4.png"),
  rawImage4x1,
  rawImage2x4,
  rawImageY8,
  rawImageY16,
  rawImageRGB24,
  rawImageRGB32
};

export default images;
