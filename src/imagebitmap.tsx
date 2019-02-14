import { NodeImage } from "./elements/image";
import { IImageBitmap, IImageData } from "./interfaces";

interface RawImageInfo {
  readonly format: "raw";
  readonly width: number;
  readonly height: number;
  readonly channels: 1 | 2 | 3 | 4;
  readonly premultiplied: false;
  readonly size: number;
}

export interface IRawImage {
  readonly info: RawImageInfo;
  readonly data: Buffer;
}

// supported image types by channel count
const Y8 = 1; // gray (named after luma, shortened traditionally to Y)
const Y16 = 2; // gray, alpha
const RGB24 = 3; // red, green, blue
const RGB32 = 4; // red, green, blue, alpha

// image channel indexes
const R = 0; // RGB24/RGB32 red
const G = 1; // RGB24/RGB32 green
const B = 2; // RGB24/RGB32 blue
const A = 3; // RGB32 alpha
const Y = 0; // Y8/Y16 gray
const YA = 1; // Y16 alpha

const INVALID_RAW_IMAGE_CHANNELS_ERROR =
  "Raw image data must consist of 1-4 channels.";
const INVALID_RAW_IMAGE_SIZE_ERROR =
  "Raw image data buffer size must match the value of width * height * channels provided in the info object.";
const RGB24_SIZE_ERROR = "RGB24 pixel array must have exactly 3 values.";
const RGB32_SIZE_ERROR = "RGB32 pixel array must have exactly 4 values.";
const EMPTY_IMAGE_DATA_ERROR = "Cannot request empty image data.";
const DRAW_IMAGE_NO_RESIZE_ERROR =
  "Resizing is not supported. Source and target draw rects must be equal in size.";

const EMPTY = new Uint8ClampedArray();
const RGB24_BLACK_PIXEL = new Uint8ClampedArray([0, 0, 0]);
const RGB32_BLACK_PIXEL = new Uint8ClampedArray([0, 0, 0, 255]);
const RGB32_BLANK_PIXEL = new Uint8ClampedArray([0, 0, 0, 0]);

export function isImageBitmap(bitmap: any): bitmap is NodeImageBitmap {
  if (bitmap._isImageBitmap) return true;
  return false;
}

export class NodeImageBitmap implements IImageBitmap {
  private readonly $rgbOutOfBounds = new Uint8ClampedArray(RGB24_BLACK_PIXEL);
  private $width: number;
  private $height: number;
  private $rgb: Uint8ClampedArray;
  private $alpha: Uint8ClampedArray;
  private $hasAlpha: boolean = true;
  private $closed: boolean = false;

  public readonly _isImageBitmap = true;
  public readonly _premultipliedAlpha = false;

  close() {
    this.$closed = true;
  }

  get width() {
    if (this.$closed) return 0;
    return this.$width;
  }

  get height() {
    if (this.$closed) return 0;
    return this.$height;
  }

  get _hasAlpha() {
    return this.$hasAlpha;
  }

  set _hasAlpha(value: boolean) {
    this.$hasAlpha = value;
    if (!value && this.$alpha) this.$alpha.fill(255);
  }

  get _rgbData() {
    if (this.$closed) return EMPTY;
    return this.$rgb;
  }

  get _alphaData() {
    if (this.$closed) return EMPTY;
    return this.$alpha;
  }

  constructor(input?: IRawImage) {
    if (!input) {
      this.$width = 0;
      this.$height = 0;
      this.$rgb = new Uint8ClampedArray();
      this.$alpha = new Uint8ClampedArray();
      this._hasAlpha = true;
      return this;
    }
    const { data, info } = input;

    if (data.length !== info.width * info.height * info.channels) {
      throw new Error(INVALID_RAW_IMAGE_SIZE_ERROR);
    }

    this.$width = info.width;
    this.$height = info.height;
    let size = data.length / info.channels;
    let rgb = new Uint8ClampedArray(size * 3);
    let alpha = new Uint8ClampedArray(size);
    switch (info.channels) {
      case Y8: // 1
        this._hasAlpha = false;
        for (let i = 0; i < size; ++i) {
          rgb[i * RGB24 + R] = data[i];
          rgb[i * RGB24 + G] = data[i];
          rgb[i * RGB24 + B] = data[i];
          alpha[i] = 255;
        }
        break;
      case Y16: // 2
        this._hasAlpha = true;
        for (let i = 0; i < size; ++i) {
          rgb[i * RGB24 + R] = data[i * Y16 + Y];
          rgb[i * RGB24 + G] = data[i * Y16 + Y];
          rgb[i * RGB24 + B] = data[i * Y16 + Y];
          alpha[i] = data[i * Y16 + YA];
        }
        break;
      case RGB24: // 3
        this._hasAlpha = false;
        rgb.set(data);
        alpha.fill(255);
        break;
      case RGB32: // 4
        this._hasAlpha = true;
        for (let i = 0; i < size; ++i) {
          rgb[i * RGB24 + R] = data[i * RGB32 + R];
          rgb[i * RGB24 + G] = data[i * RGB32 + G];
          rgb[i * RGB24 + B] = data[i * RGB32 + B];
          alpha[i] = data[i * RGB32 + A];
        }
        break;
      default:
        throw new Error(INVALID_RAW_IMAGE_CHANNELS_ERROR);
    }
    this.$rgb = rgb;
    this.$alpha = alpha;
  }

  _resize(width: number, height: number) {
    const oldSize = this.width * this.height;
    const oldWidth = this.$width;
    const oldHeight = this.$height;
    const size = width * height;
    const alpha = this._hasAlpha ? 0 : 255;

    this.$width = width;
    this.$height = height;

    if (size !== oldSize) {
      this.$rgb = new Uint8ClampedArray(size * 3);
      this.$alpha = new Uint8ClampedArray(size);
    } else {
      // even if pixel data size remains the same,
      // reset the data if the dimensions are different
      if (width !== oldWidth || height !== oldHeight) {
        this.$rgb.fill(0);
        this.$alpha.fill(alpha);
      }
    }
  }

  // drawImage-related functions

  _getRGB(x: number, y: number): Uint8ClampedArray {
    if (x < 0) x += this.$width;
    if (y < 0) y += this.$height;

    // return the out of bounds pixel if attempting to get out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return this.$rgbOutOfBounds;
    }

    const index = y * this.$width + x;
    return this.$rgb.subarray(index * RGB24, index * RGB24 + RGB24);
  }

  _getAlpha(x: number, y: number): number {
    if (x < 0) x += this.$width;
    if (y < 0) y += this.$height;

    // return transparent or opaque value if attempting to get out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return this._hasAlpha ? 0 : 255;
    }

    const index = y * this.$width + x;
    return this._hasAlpha ? this.$alpha[index] : 255;
  }

  _setRGB(x: number, y: number, rgb: Uint8ClampedArray): void;
  _setRGB(x: number, y: number, r: number, g: number, b: number): void;
  _setRGB(
    x: number,
    y: number,
    rOrRgb: Uint8ClampedArray | number,
    g?: number,
    b?: number
  ) {
    if (x < 0) x += this.$width;
    if (y < 0) y += this.$height;

    // do nothing if attempting to set out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return;
    }

    const index = y * this.$width + x;

    if (typeof rOrRgb === "number") {
      this.$rgb[index * RGB24 + R] = rOrRgb;
      this.$rgb[index * RGB24 + G] = g!;
      this.$rgb[index * RGB24 + B] = b!;
    } else {
      if (rOrRgb.length !== 3) {
        throw new Error(RGB24_SIZE_ERROR);
      }
      this.$rgb.set(rOrRgb, index * RGB24);
    }
  }

  _setAlpha(x: number, y: number, alpha: number) {
    if (!this._hasAlpha) return;
    if (x < 0) x += this.$width;
    if (y < 0) y += this.$height;

    // do nothing if attempting to set out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return;
    }

    const index = y * this.$width + x;
    this.$alpha[index] = alpha;
  }

  _drawPixel(x: number, y: number, rgb: Uint8ClampedArray, alpha?: number) {
    if (x < 0) x += this.$width;
    if (y < 0) y += this.$height;

    // do nothing if attempting to draw out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return;
    }

    if (rgb.length !== 3) {
      throw new Error(RGB24_SIZE_ERROR);
    }

    // if pixel is transparent do nothing since nothing needs to be drawn
    if (alpha === 0) {
      return;
    }

    if (alpha == null || alpha === 255) {
      // no alpha blending (as alpha = 255), so just replace the pixel
      this._setRGB(x, y, rgb);
      this._setAlpha(x, y, 255);
    } else {
      // alpha blending (as alpha = 1-254), take source alpha into account
      const [Ra, Ga, Ba] = this._getRGB(x, y);
      const Aa = this._getAlpha(x, y);
      const [Rb, Gb, Bb] = rgb;
      const Ab = alpha;
      const R = (Ra * Aa) / 255 + (Rb * Ab * (255 - Aa)) / (255 * 255);
      const G = (Ga * Aa) / 255 + (Gb * Ab * (255 - Aa)) / (255 * 255);
      const B = (Ba * Aa) / 255 + (Bb * Ab * (255 - Aa)) / (255 * 255);
      const A = Aa + (Ab * (255 - Aa)) / 255;
      this._setRGB(x, y, R, G, B);
      this._setAlpha(x, y, A);
    }
  }

  _drawImage(image: NodeImageBitmap, dx: number, dy: number): void;
  _drawImage(
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
  _drawImage(
    image: NodeImageBitmap,
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
      // non-standard error since we don't handle resizing
      throw new Error(DRAW_IMAGE_NO_RESIZE_ERROR);
    }
    for (let y = 0; y < sh; ++y) {
      for (let x = 0; x < sw; ++x) {
        const rgb = image._getRGB(sx + x, sy + y);
        const alpha = image._getAlpha(sx + x, sy + y);
        this._drawPixel(dx + x, dy + y, rgb, alpha);
      }
    }
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

    if (pixel.length !== 4) {
      throw new Error(RGB32_SIZE_ERROR);
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

    // transform left/top-extending rectangles (negative width/height)
    // into regular right/bottom-extending rectangles
    if (width < 0) {
      sx += width;
      width *= -1;
    }
    if (height < 0) {
      sy += height;
      height *= -1;
    }

    if (width === 0 || height === 0) {
      throw new Error(EMPTY_IMAGE_DATA_ERROR);
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

  _toRawImage(): IRawImage {
    const channels = this._hasAlpha ? 4 : 3;
    const width = this.$width;
    const height = this.$height;
    const size = width * height;
    const buf = Buffer.alloc(size * channels);
    for (let i = 0; i < size; ++i) {
      buf[i * channels + R] = this.$rgb[i * RGB24 + R];
      buf[i * channels + G] = this.$rgb[i * RGB24 + G];
      buf[i * channels + B] = this.$rgb[i * RGB24 + B];
      if (channels === 4) buf[i * channels + A] = this.$alpha[i];
    }
    return {
      info: {
        format: "raw",
        width,
        height,
        channels,
        premultiplied: false,
        size: size * channels
      },
      data: buf
    };
  }
}
