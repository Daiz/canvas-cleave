import { resolve } from "path";

const images = {
  redYellowTiled: resolve(__dirname, "images/red-yellow.png"),
  redYellowGreenTiled: resolve(__dirname, "images/red-yellow-green.png"),
  yellowGreenTiled: resolve(__dirname, "images/yellow-green.png"),
  green: resolve(__dirname, "images/green.png"),
  greenStickerTiled: resolve(__dirname, "images/green-sticker.png"),
  sticker: resolve(__dirname, "images/sticker.png"),
  yellowGreenTiledWithStickerOverlay: resolve(
    __dirname,
    "images/yellow-green+sticker.png"
  )
};

export default images;
