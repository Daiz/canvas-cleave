import { IImageData } from "./interfaces";

const RGB32 = 4;

/**
 * @public
 */
export class NodeImageData implements IImageData {
  readonly data: Uint8ClampedArray;

  constructor(
    public readonly width: number,
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
