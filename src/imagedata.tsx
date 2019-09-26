import { IImageData } from "./interfaces";

const RGB32 = 4;

/**
 * A Node implementation of DOM ImageData.
 * @public
 */
export class NodeImageData implements IImageData {
  /**
   * The actual RGB32 image data. The length of the data is width * height * 4 (bytes per pixel).
   */
  readonly data: Uint8ClampedArray;

  /**
   *
   * @param width - The width of the image data in pixels.
   * @param height - The height of the image data in pixels.
   * @param data - Optional initial RGB32 image data.
   */
  constructor(
    /**
     * The width of the image data in pixels.
     */
    public readonly width: number,
    /**
     * The height of the image data in pixels.
     */
    public readonly height: number,
    data?: Uint8ClampedArray
  ) {
    const size = width * height * RGB32;
    if (data) {
      if (size !== data.length) {
        throw new Error(
          "Input data length must match provided width * height * 4"
        );
      }
      this.data = data;
    } else {
      this.data = new Uint8ClampedArray(size);
    }
  }
}
