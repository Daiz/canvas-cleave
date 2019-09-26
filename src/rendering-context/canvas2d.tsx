import { NodeImageBitmap } from "../imagebitmap";
import { NINodeCanvas, NINodeImage } from "../imagebitmapconsumer";
import { NodeImageData } from "../imagedata";
import { ICanvasRenderingContext2D, IImageData } from "../interfaces";

/**
 * Node interface for {@link NodeCanvasRenderingContext2D} input image type support.
 * @public
 */
export type NINodeCanvasImageSource =
  | NINodeCanvas
  | NINodeImage
  | NodeImageBitmap;

/**
 * A limited Node implementation for DOM CanvasRenderingContext2D.
 * @public
 */
export class NodeCanvasRenderingContext2D implements ICanvasRenderingContext2D {
  /**
   *
   * @param canvas - Reference to the canvas that this rendering context is for.
   * @public
   */
  constructor(
    /**
     * Reference to the canvas that this rendering context is for.
     */
    public readonly canvas: NINodeCanvas
  ) {}

  /**
   * Draw an image to the canvas at the specified coordinates.
   * @param image - The image to draw.
   * @param dx - The x coordinate to draw the image to.
   * @param dy - The y coordinate to draw the image to.
   * @public
   */
  drawImage(image: NINodeCanvasImageSource, dx: number, dy: number): void;
  /**
   * Draw a region of an image to the canvas at the specified coordinates.
   * @param image - The image to draw.
   * @param sx - The x coordinate of the source region.
   * @param sy - The y coordinate of the source region.
   * @param sw - The width of the source region. Can be negative to extend left.
   * @param sh - The height of the source region. Can be negative to extend up.
   * @param dx - The x coordinate on the destination region.
   * @param dy - The y coordinate of the destination region.
   * @param dw - The width of the destination region. Must equal abs(sw).
   * @param dh - The height of the destination region. Must equal abs(sh).
   * @public
   */
  drawImage(
    image: NINodeCanvasImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void;
  drawImage(): void {
    const input: NINodeCanvasImageSource = arguments[0];
    arguments[0] = NodeImageBitmap.isImageBitmap(input)
      ? input
      : input._getImageBitmap();
    const bitmap = this.canvas._getImageBitmap();
    // @ts-ignore As we just pass arguments to the underlying implementation
    bitmap._drawImage.apply(bitmap, arguments);
  }
  /**
   * Get ImageData for the defined region of the canvas.
   * @param sx - The x coordinate of the region.
   * @param sy - The y coordinate of the region.
   * @param sw - The width of the region. Can be negative to extend left.
   * @param sh - The height of the region. Can be negative to extend up.
   * @public
   */
  getImageData(sx: number, sy: number, sw: number, sh: number): IImageData {
    const bitmap = this.canvas._getImageBitmap();
    return bitmap._getImageData(sx, sy, sw, sh);
  }
  /**
   * Replace a region of the canvas with the supplied ImageData.
   * @param data - The ImageData to use for the replacement.
   * @param dx - The x coordinate of the region.
   * @param dy - The y coordinate of the region.
   * @public
   */
  putImageData(imageData: IImageData, dx: number, dy: number): void;
  /**
   * Replace a region of the canvas with a region of the supplied ImageData.
   * @param data - The ImageData to use for the replacement.
   * @param dx - The x coordinate of the destination region.
   * @param dy - The y coordinate of the destination region.
   * @param dirtyX - The x coordinate of the source region. Default 0.
   * @param dirtyY - The y coordinate of the source region. Default 0.
   * @param dirtyWidth - The width of the source region. Default `ImageData.width`.
   * @param dirtyHeight - The height of the source region. Default `ImageData.height`.
   * @public
   */
  putImageData(
    imageData: IImageData,
    dx: number,
    dy: number,
    dirtyX: number,
    dirtyY: number,
    dirtyWidth: number,
    dirtyHeight: number
  ): void;
  putImageData(): void {
    const bitmap = this.canvas._getImageBitmap();
    // @ts-ignore As we just pass arguments to the underlying implementation
    bitmap._putImageData.apply(bitmap, arguments);
  }
  /**
   * Create empty ImageData with dimensions copied from provided ImageData.
   * @param data - The reference ImageData to copy the dimensions of.
   * @public
   */
  createImageData(data: IImageData): IImageData;
  /**
   * Create empty ImageData with the provided dimensions.
   * @param width - The width of the ImageData.
   * @param height - The height of the ImageData.
   * @public
   */
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
    return new NodeImageData(width, height);
  }
}
