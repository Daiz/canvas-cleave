import { NodeCanvas } from "../elements/canvas";
import { NodeImage } from "../elements/image";
import { NodeImageBitmap } from "../imagebitmap";
import { ICanvasRenderingContext2D, IImageData } from "../interfaces";

type NodeCanvasImageSource = NodeCanvas | NodeImage | NodeImageBitmap;

/**
 * @public
 */
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
  drawImage() {
    const input: NodeCanvasImageSource = arguments[0];
    arguments[0] = NodeImageBitmap.isImageBitmap(input)
      ? input
      : input._getImageBitmap();
    const bitmap = this.canvas._getImageBitmap();
    // @ts-ignore As we just pass arguments to the underlying implementation
    bitmap._drawImage.apply(bitmap, arguments);
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
  putImageData() {
    const bitmap = this.canvas._getImageBitmap();
    // @ts-ignore As we just pass arguments to the underlying implementation
    bitmap._putImageData.apply(bitmap, arguments);
  }
}
