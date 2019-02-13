import { NodeImage } from "./elements/image";
import { IImageBitmap, IImageData } from "./interfaces";

export interface RawImageInfo {
  readonly width: number;
  readonly height: number;
  readonly channels: number;
}

export interface RawImage {
  readonly info: RawImageInfo;
  readonly data: Buffer;
}

const GRAY8A = 2;
const RGB24 = 3;
const RGB32 = 4;
const R = 0;
const G = 1;
const B = 2;
const A = 4;
const G8 = 0;
const G8A = 1;

const RGB24_BLACK_PIXEL = new Uint8ClampedArray([0, 0, 0]);
const RGB32_BLACK_PIXEL = new Uint8ClampedArray([0, 0, 0, 255]);
const RGB32_BLANK_PIXEL = new Uint8ClampedArray([0, 0, 0, 0]);

export function isImageBitmap(bitmap: any): bitmap is NodeImageBitmap {
  if (bitmap._isImageBitmap) return true;
  return false;
}

export class NodeImageBitmap implements IImageBitmap {
  private readonly $rgbBlack = new Uint8ClampedArray(RGB24_BLACK_PIXEL);
  private $width: number;
  private $height: number;
  private $rgb: Uint8ClampedArray;
  private $alpha: Uint8ClampedArray;
  private $closed: boolean = false;

  public readonly _isImageBitmap = true;
  public readonly _premultipliedAlpha = false;
  public _hasAlpha: boolean;

  close() {
    this.$closed = true;
  }

  get width() {
    if (this.$closed) return 0;
    else return this.$width;
  }

  get height() {
    if (this.$closed) return 0;
    else return this.$height;
  }

  constructor(input?: RawImage) {
    if (!input) {
      this.$width = 0;
      this.$height = 0;
      this.$rgb = new Uint8ClampedArray();
      this.$alpha = new Uint8ClampedArray();
      this._hasAlpha = true;
      return this;
    }
    const { data, info } = input;
    this.$width = info.width;
    this.$height = info.height;
    let size = data.length / info.channels;
    let rgb = new Uint8ClampedArray(size * 3);
    let alpha = new Uint8ClampedArray(size);
    switch (info.channels) {
      // GRAY8
      case 1:
        this._hasAlpha = false;
        for (let i = 0; i < size; ++i) {
          rgb[i * RGB24 + R] = data[i];
          rgb[i * RGB24 + G] = data[i];
          rgb[i * RGB24 + B] = data[i];
        }
        break;
      // GRAY8 + ALPHA
      case 2:
        this._hasAlpha = true;
        for (let i = 0; i < size; ++i) {
          rgb[i * RGB24 + R] = data[i * GRAY8A + G8];
          rgb[i * RGB24 + G] = data[i * GRAY8A + G8];
          rgb[i * RGB24 + B] = data[i * GRAY8A + G8];
          alpha[i] = data[i * GRAY8A + G8A];
        }
        break;
      // RGB24
      case 3:
        this._hasAlpha = false;
        rgb.set(data);
        break;
      // RGB32
      case 4:
        this._hasAlpha = true;
        for (let i = 0; i < size; ++i) {
          rgb[i * RGB24 + R] = data[i * RGB32 + R];
          rgb[i * RGB24 + G] = data[i * RGB32 + G];
          rgb[i * RGB24 + B] = data[i * RGB32 + B];
          alpha[i] = data[i * RGB32 + A];
        }
        break;
      default:
        throw new Error("Source image must have 1-4 channels.");
    }
    this.$rgb = rgb;
    this.$alpha = alpha;
  }

  _resize(width: number, height: number) {
    const oldSize = this.width * this.height;
    const size = width * height;

    if (size !== oldSize) {
      this.$width = width;
      this.$height = height;
      this.$rgb = new Uint8ClampedArray(size * 3);
      this.$alpha = new Uint8ClampedArray(size);
    }
  }

  // drawing-related functions

  _getRGB(x: number, y: number): Uint8ClampedArray {
    if (x < 0) x += this.$width;
    if (y < 0) y += this.$height;

    // return a black pixel if attempting to get out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return this.$rgbBlack;
    }

    const index = y * this.width + x;
    return this.$rgb.subarray(index * RGB24, index * RGB24 + RGB24);
  }

  _getAlpha(x: number, y: number): number {
    if (x < 0) x += this.$width;
    if (y < 0) y += this.$height;

    // return transparent or opaque value if attempting to get out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return this._hasAlpha ? 0 : 255;
    }

    const index = y * this.width + x;
    return this._hasAlpha ? this.$alpha[index] : 255;
  }

  _setRGB(x: number, y: number, rgb: Uint8ClampedArray) {
    if (x < 0) x += this.$width;
    if (y < 0) y += this.$height;

    // do nothing if attempting to set out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return;
    }

    const index = y * this.width + x;
    this.$rgb.set(rgb, index * RGB24);
  }

  _setAlpha(x: number, y: number, alpha: number) {
    if (!this._hasAlpha) return;
    if (x < 0) x += this.$width;
    if (y < 0) y += this.$height;

    // do nothing if attempting to set out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return;
    }

    const index = y * this.width + x;
    this.$alpha[index] = alpha;
  }

  _drawPixel(x: number, y: number, rgba: Uint8ClampedArray): void;
  _drawPixel(x: number, y: number, rgb: Uint8ClampedArray, alpha: number): void;
  _drawPixel(
    x: number,
    y: number,
    rgbOrRgba: Uint8ClampedArray,
    alpha?: number
  ) {
    // TODO: implement with alpha blending (important!)
    if (x < 0) x += this.$width;
    if (y < 0) y += this.$height;
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return; // do nothing if attempting to draw out of bounds
    }

    if (alpha != null && rgbOrRgba.length !== 3) {
      throw new Error("RGB24 value must have 3 exactly components.");
    }
    if (alpha == null && rgbOrRgba.length !== 4) {
      throw new Error("RGB32 value must have exactly 4 components.");
    }

    const [R, G, B] = rgbOrRgba;
    const A = alpha != null ? alpha : rgbOrRgba[3];

    const index = y * this.width + x;

    if (A === 255) {
      // no alpha blending, so just replace the pixel
      this.$rgb[index * RGB24 + R] = R;
      this.$rgb[index * RGB24 + G] = G;
      this.$rgb[index * RGB24 + B] = B;
      this.$alpha[index] = 255;
    } else {
      // alpha blending, take source alpha into account
      const [sR, sG, sB] = this.$rgb.subarray(index * RGB24);
      const sA = this._hasAlpha ? this.$alpha[index] : 255;
      if (sA === 255) {
        // overlay
      } else {
        // blend
      }
    }
  }

  _drawNodeImageBitmap(image: NodeImageBitmap, dx: number, dy: number): void;
  _drawNodeImageBitmap(
    image: NodeImageBitmap,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void;
  _drawNodeImageBitmap(
    image: NodeImageBitmap,
    dxOrSx: number,
    dyOrSy: number,
    sw?: number,
    sh?: number,
    dx?: number,
    dy?: number,
    dw?: number,
    dh?: number
  ) {
    // TODO: implement
  }

  // ImageData-related functions

  _getPixel(x: number, y: number): Uint8ClampedArray {
    if (x < 0) x += this.$width;
    if (y < 0) y += this.$height;

    // return a blank or black pixel if requested coordinates are out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return new Uint8ClampedArray(
        this._hasAlpha ? RGB32_BLANK_PIXEL : RGB32_BLACK_PIXEL
      );
    }

    const index = y * this.$width + x;

    const pixel = new Uint8ClampedArray(4);
    pixel[R] = this.$rgb[index * RGB24 + R];
    pixel[G] = this.$rgb[index * RGB24 + G];
    pixel[B] = this.$rgb[index * RGB24 + B];
    pixel[A] = this._hasAlpha ? this.$alpha[index] : 255;
    return pixel;
  }

  _setPixel(x: number, y: number, pixel: Uint8ClampedArray) {
    if (x < 0) x += this.$width;
    if (y < 0) y += this.$height;

    // do nothing if trying to set a pixel out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return;
    }

    const index = y * this.$width + x;

    this.$rgb[index * RGB24 + R] = pixel[R];
    this.$rgb[index * RGB24 + G] = pixel[G];
    this.$rgb[index * RGB24 + B] = pixel[B];
    if (this._hasAlpha) this.$alpha[index] = pixel[A];
  }

  _getImageData(
    sx: number,
    sy: number,
    width: number,
    height: number
  ): IImageData {
    if (sx < 0) sx += this.$width;
    if (sy < 0) sy += this.$height;
    if (width < 0) {
      sx += width;
      width *= -1;
    }
    if (height < 0) {
      sy += height;
      height *= -1;
    }
    const size = width * height * RGB32;
    const data = new Uint8ClampedArray(size);
    let index = 0;
    for (let y = sy; y < sy + height; ++y) {
      for (let x = sx; x < sx + width; ++x) {
        data.set(this._getPixel(x, y), index * RGB32);
        index += RGB32;
      }
    }
    return {
      width,
      height,
      data
    };
  }

  _putImageData(imageData: IImageData, dx: number, dy: number): void;
  _putImageData(
    imageData: IImageData,
    dx: number,
    dy: number,
    dirtyX: number,
    dirtyY: number,
    dirtyWidth: number,
    dirtyHeight: number
  ): void;
  _putImageData(
    imageData: IImageData,
    dx: number,
    dy: number,
    dirtyX?: number,
    dirtyY?: number,
    dirtyWidth?: number,
    dirtyHeight?: number
  ) {
    // TODO: implement
  }

  _toImage(): NodeImage {
    return new NodeImage(this);
  }

  _toRawImage(): RawImage {
    const channels = this._hasAlpha ? 4 : 3;
    const width = this.$width;
    const height = this.$height;
    const size = width * height;
    const buf = new Buffer(size * channels);
    for (let i = 0; i < size; ++i) {
      buf[i * channels + R] = this.$rgb[i * RGB24 + R];
      buf[i * channels + G] = this.$rgb[i * RGB24 + G];
      buf[i * channels + B] = this.$rgb[i * RGB24 + B];
      if (channels === 4) buf[i * channels + A] = this.$alpha[i];
    }
    return {
      info: { width, height, channels },
      data: buf
    };
  }
}
