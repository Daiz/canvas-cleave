import { Image } from "./image";
import { ImageData } from "./imagedata";

type RenderingContext = "2d";

interface BufferInfo {
  width: number;
  height: number;
}
export interface BufferWithInfo {
  info: BufferInfo;
  data: Buffer;
}

export class Canvas {
  private __context: CanvasRenderingContext2D;

  constructor(width?: number, height?: number) {
    width = width || 0;
    height = height || 0;
    this.__context = new CanvasRenderingContext2D(width, height);
    this.width = width;
    this.height = height;
  }

  getContext(ctx: RenderingContext) {
    return this.__context;
  }

  get width() {
    return this.__context.width;
  }
  get height() {
    return this.__context.height;
  }
  set width(x: number) {
    this.__context.width = x;
  }
  set height(y: number) {
    this.__context.height = y;
  }

  // non-standard methods for functional shimming purposes
  _toBuffer(): Buffer;
  _toBuffer(withInfo: boolean): BufferWithInfo;
  _toBuffer(withInfo: boolean = false) {
    const buf = this.__context.getImageData()._toBuffer();
    if (withInfo) {
      return {
        info: { width: this.width, height: this.height },
        data: buf
      };
    } else {
      return buf;
    }
  }
}

export class CanvasRenderingContext2D {
  width: number;
  height: number;
  private __data: ImageData;

  constructor();
  constructor(image: Image);
  constructor(imageData: ImageData);
  constructor(width: number, height: number);
  constructor(data?: Image | ImageData | number, height?: number) {
    if (data instanceof Image) {
      data = data._getImageData();
    }
    if (data instanceof ImageData) {
      this.width = data.width;
      this.height = data.height;
      this.__data = data;
    } else {
      this.width = data || 0;
      this.height = height || 0;
      this.__data = new ImageData(this.width, this.height);
    }
  }

  putImageData(data: Image | ImageData) {
    if (data instanceof Image) {
      data = data._getImageData();
    }
    this.width = data.width;
    this.height = data.height;
    this.__data = data;
  }

  getImageData() {
    return this.__data;
  }

  // note: doesn't actually support alpha - pixels get replaced, not overlaid
  drawImage(image: Image, dx: number, dy: number): void;
  drawImage(
    image: Image,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void;
  // actual implementation
  drawImage(
    image: Image,
    sx: number,
    sy: number,
    sw?: number,
    sh?: number,
    dx?: number,
    dy?: number,
    dw?: number,
    dh?: number
  ) {
    // if short call form is used, fill the rest of the params
    dx = sw ? dx || 0 : sx;
    dy = sw ? dy || 0 : sy;
    sx = sw ? sx : 0;
    sy = sw ? sy : 0;
    sw = sw || image.width;
    sh = sh || image.height;
    dw = dw || sw;
    dh = dh || sh;
    if (dw !== sw || dh !== sh) {
      // non-standard error since we don't handle resizing in this shim
      throw new Error("Source and target draw rects must be equal in size.");
    }
    const imageData = image._getImageData();
    for (let y = 0; y < sh; ++y) {
      for (let x = 0; x < sw; ++x) {
        const px = imageData._getPixel(sx + x, sy + y);
        this.__data._setPixel(dx + x, dy + y, px);
      }
    }
  }
}
