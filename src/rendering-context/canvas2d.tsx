import { NodeCanvas } from "../canvas";
import { NodeImage } from "../image";
import { isImageBitmap, NodeImageBitmap } from "../imagebitmap";
import { ICanvasRenderingContext2D, IImageData } from "../interfaces";

type NodeCanvasImageSource = NodeCanvas | NodeImage | NodeImageBitmap;

export class NodeCanvasRenderingContext2D implements ICanvasRenderingContext2D {
  constructor(public readonly canvas: NodeCanvas) {}

  drawImage(image: NodeCanvasImageSource, dx: number, dy: number): void;
  drawImage(
    image: NodeCanvasImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void;
  drawImage(
    image: NodeCanvasImageSource,
    dxOrSx: number,
    dyOrSy: number,
    sw?: number,
    sh?: number,
    dx?: number,
    dy?: number,
    dw?: number,
    dh?: number
  ) {
    const source = isImageBitmap(image) ? image : image._getImageBitmap();
    const bitmap = this.canvas._getImageBitmap();
    // @ts-ignore
    bitmap._drawNodeImageBitmap(source, dxOrSx, dyOrSy, sw, sh, dx, dy, dw, dh);
  }

  createImageData(data: IImageData): IImageData;
  createImageData(width: number, height: number): IImageData;
  createImageData(
    widthOrData: number | IImageData,
    height: number = 0
  ): IImageData {
    let width = 0;
    if (typeof widthOrData === "number") {
      width = widthOrData;
    } else {
      width = widthOrData.width;
      height = widthOrData.height;
    }
    const size = width * height * 4;
    return {
      width,
      height,
      data: new Uint8ClampedArray(size)
    };
  }

  getImageData(sx: number, sy: number, sw: number, sh: number) {
    const bitmap = this.canvas._getImageBitmap();
    return bitmap._getImageData(sx, sy, sw, sh);
    /*
    if (sw === 0 || sh === 0) {
      throw new Error("Cannot request empty image data.");
    }
    // transform left/top-extending rectangles (negative width/height)
    // into regular right/bottom-extending rectangles
    if (sw < 0) {
      sx += sw;
      sw *= -1;
    }
    if (sh < 0) {
      sy += sh;
      sh *= -1;
    }

    const len = sw * sh;
    const data = new Uint8ClampedArray(len * 4);
    const src = this.canvas._getImageBitmap();

    for (let i = 0; i < len; ++i) {
      const x = (i % sw) + sx;
      const y = (i - (i % sw)) / sw + sy;
      // returns transparent or opaque black pixels when out of bounds
      if (x < 0 || y < 0 || x >= src.width || y >= src.height) {
        data[i + 0] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = src._hasAlpha ? 0 : 255;
      } else {
        const index = y * src.height + x;
        data[i + 0] = src[index + 0];
        data[i + 1] = src[index + 1];
        data[i + 2] = src[index + 2];
        data[i + 3] = src[index + 3];
      }
    }

    return {
      width: sw,
      height: sh,
      data
    };
    */
  }

  putImageData(imageData: IImageData, dx: number, dy: number): void;
  putImageData(
    imageData: IImageData,
    dx: number,
    dy: number,
    dirtyX: number,
    dirtyY: number,
    dirtyWidth: number,
    dirtyHeight: number
  ): void;
  putImageData(
    imageData: IImageData,
    dx: number,
    dy: number,
    dirtyX?: number,
    dirtyY?: number,
    dirtyWidth?: number,
    dirtyHeight?: number
  ) {
    const bitmap = this.canvas._getImageBitmap();
    bitmap._putImageData(
      imageData,
      dx,
      dy,
      // @ts-ignore
      dirtyX,
      dirtyY,
      dirtyWidth,
      dirtyHeight
    );
  }
}
