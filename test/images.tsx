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

const images = {
  redYellow: resolve(__dirname, "images/red-yellow.png"),
  redYellowGreen: resolve(__dirname, "images/red-yellow-green.png"),
  yellowGreen: resolve(__dirname, "images/yellow-green.png"),
  green: resolve(__dirname, "images/green.png"),
  greenSticker: resolve(__dirname, "images/green-sticker.png"),
  sticker: resolve(__dirname, "images/sticker.png"),
  yellowGreenWithSticker: resolve(__dirname, "images/yellow-green+sticker.png"),
  rawImage4x1,
  rawImage2x4
};

export default images;
