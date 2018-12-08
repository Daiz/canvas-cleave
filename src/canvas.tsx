import { NodeImage } from "./image";
import { NodeImageData } from "./imagedata";

type RenderingContext = "2d";

interface BufferInfo {
  width: number;
  height: number;
}
export interface BufferWithInfo {
  info: BufferInfo;
  data: Buffer;
}

export class NodeCanvas {
  private __context: NodeCanvasRenderingContext2D;

  constructor(width?: number, height?: number) {
    width = width || 0;
    height = height || 0;
    this.__context = new NodeCanvasRenderingContext2D(width, height);
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

export class NodeCanvasRenderingContext2D {
  width: number;
  height: number;
  private __data: NodeImageData;

  constructor();
  constructor(image: NodeImage);
  constructor(imageData: NodeImageData);
  constructor(width: number, height: number);
  constructor(data?: NodeImage | NodeImageData | number, height?: number) {
    if (data instanceof NodeImage) {
      data = data._getImageData();
    }
    if (data instanceof NodeImageData) {
      this.width = data.width;
      this.height = data.height;
      this.__data = data;
    } else {
      this.width = data || 0;
      this.height = height || 0;
      this.__data = new NodeImageData(this.width, this.height);
    }
  }

  putImageData(data: NodeImage | NodeImageData) {
    if (data instanceof NodeImage) {
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
  drawImage(image: NodeImage, dx: number, dy: number): void;
  drawImage(
    image: NodeImage,
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
    image: NodeImage,
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
