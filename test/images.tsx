import { resolve } from "path";
import { NIRawImage } from "../src";

const mock: NIRawImage = {
  info: {
    format: "raw",
    width: 2,
    height: 1,
    channels: 4
  },
  data: Buffer.from([255, 255, 255, 255, 0, 0, 0, 255])
};

const images = {
  redYellow: resolve(__dirname, "images/red-yellow.png"),
  redYellowGreen: resolve(__dirname, "images/red-yellow-green.png"),
  yellowGreen: resolve(__dirname, "images/yellow-green.png"),
  green: resolve(__dirname, "images/green.png"),
  greenSticker: resolve(__dirname, "images/green-sticker.png"),
  sticker: resolve(__dirname, "images/sticker.png"),
  yellowGreenWithSticker: resolve(__dirname, "images/yellow-green+sticker.png"),
  rawImage: mock
};

export default images;
