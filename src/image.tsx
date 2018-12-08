import { BufferWithInfo } from "./canvas";
import { NodeImageData } from "./imagedata";
import sharp = require("sharp");

const noop = function noop() {};
const LOAD_IMAGE_OPTS = { resolveWithObject: true };

export class NodeImage {
  private __width: number = 0;
  private __height: number = 0;
  private __src: string = "";
  private __data: NodeImageData;
  private __loaded: boolean = false;

  get width() {
    return this.__width;
  }
  get naturalWidth() {
    return this.__width;
  }
  get height() {
    return this.__height;
  }
  get naturalHeight() {
    return this.__height;
  }

  constructor() {
    this.__data = new NodeImageData();
  }

  get src() {
    return this.__src;
  }
  set src(source: string) {
    this.__src = source;
    this.__loaded = false;
    this.__data._unload();
    this.loadImage(source);
  }

  private async loadImage(source: string) {
    try {
      const { info, data } = await sharp(source)
        .removeAlpha()
        .raw()
        .toBuffer(LOAD_IMAGE_OPTS as { resolveWithObject: true });
      this.__width = info.width;
      this.__height = info.height;
      this.__data._putImageData(this.__width, this.__height, data);
      this.__loaded = true;
      this.onload();
      return true;
    } catch (err) {
      this.onerror(err);
      return false;
    }
  }

  // placeholders for onload/onerror
  onload: () => any = noop;
  onerror: (err?: Error) => any = noop;

  // non-standard methods for functional shimming purposes

  _getImageData() {
    return this.__data;
  }
}

export function loadImage(source: string): Promise<NodeImage> {
  return new Promise((resolve, reject) => {
    const img = new NodeImage();
    img.src = source;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

export async function saveImage(
  target: string,
  { info, data }: BufferWithInfo
) {
  const { width, height } = info;
  return sharp(data, {
    raw: {
      width,
      height,
      channels: 3
    }
  }).toFile(target);
}
