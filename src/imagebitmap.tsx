import { NodeImageData } from "./imagedata";
import { IImageBitmap, IImageData } from "./interfaces";

/**
 * Node interface for raw image information.
 * @public
 */
export interface NIRawImageInfo {
  /**
   * The format of the image.
   */
  readonly format?: "raw";
  /**
   * The width of the image in pixels.
   */
  readonly width: number;
  /**
   * The height of the image in pixels.
   */
  readonly height: number;
  /**
   * The channel count of the image.
   */
  readonly channels: 1 | 2 | 3 | 4;
  /**
   * Does the image have premultiplied alpha? If present, should always be false as canvas-cleave does not support premultiplied alpha.
   */
  readonly premultiplied?: boolean;
  /**
   * The size of the image in bytes. If present, must be equal to width * height * channels.
   */
  readonly size?: number;
}
/**
 * Node interface for passing around raw image data.
 * @public
 */
export interface NIRawImage {
  /**
   * The raw image info. Refer to {@link NIRawImageInfo} for details.
   */
  readonly info: NIRawImageInfo;
  /**
   * The raw image data. Length should be equal to info.size.
   */
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
const INVALID_RAW_IMAGE_DIMENSIONS_ERROR =
  "Image dimensions cannot be negative.";
const INVALID_RAW_IMAGE_SIZE_ERROR =
  "Raw image data buffer size must match the value of width * height * channels provided in the info object.";
const INVALID_RAW_IMAGE_SIZE_METADATA_ERROR =
  "Raw image data buffer size must match the value of size provided in the info object.";
const PREMULTIPLIED_ALPHA_NOT_SUPPORTED_ERROR =
  "Premultiplied alpha is not supported by canvas-cleave.";
const RGB24_SIZE_ERROR = "RGB24 pixel array must have exactly 3 values.";
const RGB32_SIZE_ERROR = "RGB32 pixel array must have exactly 4 values.";
const EMPTY_IMAGE_DATA_ERROR = "Cannot request empty image data.";
const DRAW_IMAGE_NO_RESIZE_ERROR =
  "Resizing is not supported. Source and target draw rects must be equal in size.";
const TOO_BIG_IMAGE_ERROR =
  "Trying to create an NodeImageBitmap larger than the maximum allowed memory size (1GB). Try to keep your width & height under 16384 pixels.";
const NO_INFINITY_ERROR = "No parameter can be Infinity.";
// difference from spec: negative width/height not supported in various methods
const NO_NEGATIVE_LENGTHS_ERROR = "Width and/or height cannot be negative.";

const EMPTY = new Uint8ClampedArray(0);
const RGB24_BLACK_PIXEL = new Uint8ClampedArray([0, 0, 0]);
const RGB32_BLACK_PIXEL = new Uint8ClampedArray([0, 0, 0, 255]);
const RGB32_BLANK_PIXEL = new Uint8ClampedArray([0, 0, 0, 0]);

/**
 * A Node implementation for DOM ImageBitmap.
 * @public
 */
export class NodeImageBitmap implements IImageBitmap {
  /**
   * Check if an object is an instance of NodeImageBitmap.
   * @param bitmap - The object to check.
   */
  static isImageBitmap(bitmap: any): bitmap is NodeImageBitmap {
    if (bitmap && bitmap._isImageBitmap) return true;
    return false;
  }
  /**
   * The maximum memory size of the bitmap.
   */
  static readonly MAXIMUM_MEMORY_SIZE: number = 1024 * 1024 * 1024;

  private readonly $rgbOutOfBounds: Uint8ClampedArray = new Uint8ClampedArray(
    RGB24_BLACK_PIXEL
  );
  private $width: number;
  private $height: number;
  private $rgb: Uint8ClampedArray;
  private $alpha: Uint8ClampedArray;
  private $hasAlpha: boolean = true;

  /**
   * Used for NodeImageBitmap.isImageBitmap checking.
   * @internal
   */
  public readonly _isImageBitmap: true = true;
  /**
   * NodeImageBitmap does not support premultiplied alpha.
   * @internal
   */
  public readonly _premultipliedAlpha: false = false;

  /**
   * The width of the image bitmap.
   */
  get width(): number {
    return this.$width;
  }

  /**
   * The height of the image bitmap.
   */
  get height(): number {
    return this.$height;
  }

  /**
   * Controls the image bitmap's alpha channel.
   */
  get _hasAlpha(): boolean {
    return this.$hasAlpha;
  }

  set _hasAlpha(value: boolean) {
    this.$hasAlpha = value;
    if (!value && this.$alpha) this.$alpha.fill(255);
  }
  /**
   * The raw RGB data of the image bitmap.
   */
  get _rgbData(): Uint8ClampedArray {
    return this.$rgb;
  }

  /**
   * The raw alpha data of the image bitmap.
   */
  get _alphaData(): Uint8ClampedArray {
    return this.$alpha;
  }

  constructor(input?: NIRawImage) {
    if (!input) {
      this.$width = 0;
      this.$height = 0;
      this.$rgb = new Uint8ClampedArray(0);
      this.$alpha = new Uint8ClampedArray(0);
      this._hasAlpha = true;
      return this;
    }
    const { data, info } = input;

    if (info.width < 0 || info.height < 0) {
      throw new Error(INVALID_RAW_IMAGE_DIMENSIONS_ERROR);
    }

    if (data.length !== info.width * info.height * info.channels) {
      throw new Error(INVALID_RAW_IMAGE_SIZE_ERROR);
    }

    if (info.size && data.length !== info.size) {
      throw new Error(INVALID_RAW_IMAGE_SIZE_METADATA_ERROR);
    }

    if (info.premultiplied != null && info.premultiplied === true) {
      throw new Error(PREMULTIPLIED_ALPHA_NOT_SUPPORTED_ERROR);
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

  /**
   * Resize the bitmap. Resets all pixel values to zero.
   * @param width - The new width of the bitmap.
   * @param height - The new height of the bitmap.
   * @internal
   */
  _resize(width: number, height: number): void {
    width = width < 0 || width === Infinity ? 0 : width | 0;
    height = height < 0 || height === Infinity ? 0 : height | 0;
    const oldSize = this.$width * this.$height;
    const oldWidth = this.$width;
    const oldHeight = this.$height;
    const size = width * height;
    const alpha = this._hasAlpha ? 0 : 255;

    if (size * RGB32 > NodeImageBitmap.MAXIMUM_MEMORY_SIZE) {
      throw new Error(TOO_BIG_IMAGE_ERROR);
    }

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

  /**
   * Get the RGB values for the pixel at the specified coordinate. Returns an empty pixel if coordinates are out of bounds.
   * @param x - The x coordinate of the pixel.
   * @param y - The y coordiante of the pixel.
   * @internal
   */
  _getRGB(x: number, y: number): Uint8ClampedArray {
    // return the out of bounds pixel if attempting to get out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return this.$rgbOutOfBounds;
    }

    // Convert input numbers to integers
    x = x | 0;
    y = y | 0;

    const index = y * this.$width + x;
    return this.$rgb.subarray(index * RGB24, index * RGB24 + RGB24);
  }

  /**
   * Get the alpha value for the pixel at the specified coordinate. Returns 0 or 255 (depending on if the bitmap has an alpha channel) if coordinates are out of bounds.
   * @param x - The x coordinate of the pixel.
   * @param y - The y coordinate of the pixel.
   * @internal
   */
  _getAlpha(x: number, y: number): number {
    // return transparent or opaque value if attempting to get out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return this._hasAlpha ? 0 : 255;
    }

    // Convert input numbers to integers
    x = x | 0;
    y = y | 0;

    const index = y * this.$width + x;
    return this._hasAlpha ? this.$alpha[index] : 255;
  }

  /**
   * Set the RGB values for the pixel at the specified coordinate. Does nothing if coordinates are out of bounds.
   * @param x - The x coordinate of the pixel.
   * @param y - The y coordinate of the pixel.
   * @param rgb - The RGB values to set for the pixel.
   * @internal
   */
  _setRGB(x: number, y: number, rgb: Uint8ClampedArray): void;
  /**
   * Set the RGB values for the pixel at the specified coordinate. Does nothing of coordinates are out of bounds.
   * @param x - The x coordinate of the pixel.
   * @param y - The y coordinate of the pixel.
   * @param r - The R value to set for the pixel.
   * @param g - The G value to set for the pixel.
   * @param b - The B value to set for the pixel.
   * @internal
   */
  _setRGB(x: number, y: number, r: number, g: number, b: number): void;
  _setRGB(
    x: number,
    y: number,
    rOrRgb: Uint8ClampedArray | number,
    g?: number,
    b?: number
  ): void {
    // do nothing if attempting to set out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return;
    }

    // Convert input numbers to integers
    x = x | 0;
    y = y | 0;

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

  /**
   * Set the alpha value for the pixel at the specified coordinates. Does nothing if coordinates are out of bounds.
   * @param x - The x coordinate of the pixel.
   * @param y - The y coordinate of the pixel.
   * @param alpha - The alpha value to set for the pixel.
   * @internal
   */
  _setAlpha(x: number, y: number, alpha: number): void {
    if (!this._hasAlpha) return;

    // do nothing if attempting to set out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return;
    }

    // Convert input numbers to integers
    x = x | 0;
    y = y | 0;

    const index = y * this.$width + x;
    this.$alpha[index] = alpha;
  }

  /**
   * Draw a pixel on the bitmap at the specified coordinates. Does nothing if coordinates are out of bounds.
   * @param x - The x coordinate to draw the pixel to.
   * @param y - The y coordinate to draw the pixel to.
   * @param rgb - The RGB values of the pixel to draw.
   * @param alpha - The alpha value of the pixel to draw.
   * @internal
   */
  _drawPixel(
    x: number,
    y: number,
    rgb: Uint8ClampedArray,
    alpha?: number
  ): void {
    // do nothing if attempting to draw out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return;
    }

    // Convert input numbers to integers
    x = x | 0;
    y = y | 0;

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
      const Ra = rgb[0];
      const Ga = rgb[1];
      const Ba = rgb[2];
      const Aa = alpha;
      const srgb = this._getRGB(x, y);
      const Rb = srgb[0];
      const Gb = srgb[1];
      const Bb = srgb[2];
      const Ab = this._getAlpha(x, y);

      const R = (Ra * Aa) / 255 + (Rb * Ab * (255 - Aa)) / (255 * 255);
      const G = (Ga * Aa) / 255 + (Gb * Ab * (255 - Aa)) / (255 * 255);
      const B = (Ba * Aa) / 255 + (Bb * Ab * (255 - Aa)) / (255 * 255);
      const A = Aa + (Ab * (255 - Aa)) / 255;
      this._setRGB(x, y, R, G, B);
      this._setAlpha(x, y, A);
    }
  }

  /**
   * Replace a horizontal strip of pixels in the bitmap with a strip from an image.
   * @param image - The image to source the strip from.
   * @param sx - The x coordinate of the strip in the source image.
   * @param sy - The y coordinate of the strip in the source image.
   * @param dx - The x coordinate of the destination.
   * @param dy - The y coordinate of the destination.
   * @param sw - The amount of pixels in the strip.
   * @internal
   */
  _setRow(
    image: NodeImageBitmap,
    sx: number,
    sy: number,
    dx: number,
    dy: number,
    sw: number
  ): void {
    // do nothing if attempting to set out of bounds
    if (dx + sw <= 0 || dx >= this.$width || dy < 0 || dy >= this.$height) {
      return;
    }

    // do nothing if sourcing out of bounds
    if (sx + sw <= 0 || sx >= image.width || sy < 0 || sy >= image.height) {
      return;
    }

    // Convert input numbers to integers
    sx = sx | 0;
    sy = sy | 0;
    dx = dx | 0;
    dy = dy | 0;
    sw = sw | 0;

    // to avoid replacing previous row pixels, increase sx & dx if necessary
    if (sx < 0) {
      sw += sx;
      sx = 0;
    }

    if (dx < 0) {
      sw += dx;
      dx = 0;
    }

    // to avoid replacing next row pixels, limit width if necessary
    if (sx + sw > image.width) sw = image.width - sx;
    if (dx + sw > this.$width) sw = this.$width - dx;

    const srcIdx = sy * image.width + sx;

    const rgbRow = image._rgbData.subarray(
      srcIdx * RGB24,
      (srcIdx + sw) * RGB24
    );

    const dstIdx = dy * this.$width + dx;
    this.$rgb.set(rgbRow, dstIdx * RGB24);

    if (this._hasAlpha) {
      const alphaRow = image._alphaData.subarray(srcIdx, srcIdx + sw);
      this.$alpha.set(alphaRow, dstIdx);
    }
  }

  /**
   * Draw an image to the bitmap at the specified coordinates.
   * @param image - The image to draw.
   * @param dx - The x coordinate to draw the image to.
   * @param dy - The y coordinate to draw the image to.
   * @internal
   */
  _drawImage(image: NodeImageBitmap, dx: number, dy: number): void;
  // part of the standard but not included here due to lack of resizing support
  /*
  _drawImage(
    image: NodeImageBitmap,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void;
  */
  /**
   * Draw an region of an image to the canvas at the specified coordinates.
   * @param image - The image to draw.
   * @param sx - The x coordinate of the source region.
   * @param sy - The y coordinate of the source region.
   * @param sw - The width of the source region. Can be negative to extend
   * @param sh - The height of the source region. Can be negative to extend up
   * @param dx - The x coordinate on the destination region.
   * @param dy - The y coordinate of the destination region.
   * @param dw - The width of the destination region. Must equal abs(sw).
   * @param dh - The height of the destination region. Must equal abs(sh).
   * @internal
   */
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
  ): void {
    // if short call form is used, fill the rest of the params
    dx = sw ? dx || 0 : sx;
    dy = sw ? dy || 0 : sy;
    sx = sw ? sx : 0;
    sy = sw ? sy : 0;
    sw = sw || image.width;
    sh = sh || image.height;
    dw = dw || sw;
    dh = dh || sh;

    if (sw < 0 || sh < 0 || dw < 0 || dh < 0) {
      throw new Error(NO_NEGATIVE_LENGTHS_ERROR);
    }

    if (dw !== sw || dh !== sh) {
      // non-standard error since we don't handle resizing
      throw new Error(DRAW_IMAGE_NO_RESIZE_ERROR);
    }

    // do nothing if attempting to draw completely out of bounds
    if (
      dx + dw <= 0 ||
      dx >= this.$width ||
      dy + dh <= 0 ||
      dy >= this.$height
    ) {
      return;
    }

    // Convert input numbers to integers
    sx = sx | 0;
    sy = sy | 0;
    sw = sw | 0;
    sh = sh | 0;
    dx = dx | 0;
    dy = dy | 0;
    dw = dw | 0;
    dh = dh | 0;

    for (let y = 0; y < sh; ++y) {
      if (dy + y < 0) continue;
      if (dy + y >= this.$height) break;
      if (!image._hasAlpha) {
        // draw image by setting full rows at at time
        this._setRow(image, sx, sy + y, dx, dy + y, sw);
      } else {
        // draw each individual pixel
        for (let x = 0; x < sw; ++x) {
          if (dx + x < 0) continue;
          if (dx + x >= this.$width) break;
          const rgb = image._getRGB(sx + x, sy + y);
          const alpha = image._getAlpha(sx + x, sy + y);
          this._drawPixel(dx + x, dy + y, rgb, alpha);
        }
      }
    }
  }

  // ImageData-related functions

  /**
   * Get the RGBA values for the pixel at the specified coordinates. Returns an empty pixel if out of bounds.
   * @param x - The x coordinate of the pixel.
   * @param y - The y coordinate of the pixel.
   * @internal
   */
  _getPixel(x: number, y: number): Uint8ClampedArray {
    // return a blank or black pixel if requested coordinates are out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return new Uint8ClampedArray(
        this._hasAlpha ? RGB32_BLANK_PIXEL : RGB32_BLACK_PIXEL
      );
    }

    // Convert input numbers to integers
    x = x | 0;
    y = y | 0;

    const index = y * this.$width + x;

    const pixel = new Uint8ClampedArray(4);
    pixel[R] = this.$rgb[index * RGB24 + R];
    pixel[G] = this.$rgb[index * RGB24 + G];
    pixel[B] = this.$rgb[index * RGB24 + B];
    pixel[A] = this._hasAlpha ? this.$alpha[index] : 255;
    return pixel;
  }

  /**
   * Set RGBA values for the pixel at the specified coordiantes. Does nothing if coordinates are out of bounds.
   * @param x - The x coordinate of the pixel.
   * @param y - The y coordinate of the pixel.
   * @param pixel - The RGBA values to set for the pixel.
   * @internal
   */
  _setPixel(x: number, y: number, pixel: Uint8ClampedArray): void {
    // do nothing if trying to set a pixel out of bounds
    if (x < 0 || y < 0 || x >= this.$width || y >= this.$height) {
      return;
    }

    // Convert input numbers to integers
    x = x | 0;
    y = y | 0;

    if (pixel.length !== 4) {
      throw new Error(RGB32_SIZE_ERROR);
    }

    const index = y * this.$width + x;

    this.$rgb[index * RGB24 + R] = pixel[R];
    this.$rgb[index * RGB24 + G] = pixel[G];
    this.$rgb[index * RGB24 + B] = pixel[B];
    if (this._hasAlpha) this.$alpha[index] = pixel[A];
  }

  /**
   * Get {@link NodeImageData} for the defined region of the bitmap.
   * @param sx - The x coordinate of the region.
   * @param sy - The y coordinate of the region.
   * @param width - The width of the region. Can be negative to extend left.
   * @param height - The height of the region. Can be negative to extend up.
   * @internal
   */
  _getImageData(
    sx: number,
    sy: number,
    width: number,
    height: number
  ): IImageData {
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

    // Convert input numbers to integers
    sx = sx | 0;
    sy = sy | 0;
    width = width | 0;
    height = height | 0;

    if (width === 0 || height === 0) {
      throw new Error(EMPTY_IMAGE_DATA_ERROR);
    }

    const size = width * height * RGB32;
    const data = new Uint8ClampedArray(size);
    let index = 0;
    for (let y = sy; y < sy + height; ++y) {
      for (let x = sx; x < sx + width; ++x) {
        data.set(this._getPixel(x, y), index * RGB32);
        ++index;
      }
    }
    return new NodeImageData(width, height, data);
  }

  /**
   * Replace a region of the bitmap with the supplied ImageData.
   * @param imageData - The ImageData to use for the replacement.
   * @param dx - The x coordinate of the region.
   * @param dy - The y coordinate of the region.
   * @internal
   */
  _putImageData(imageData: IImageData, dx: number, dy: number): void;
  /**
   * Replace a region of the bitmap with a region of the supplied ImageData.
   * @param imageData - The ImageData to use for the replacement.
   * @param dx - The x coordinate of the destination region.
   * @param dy - The y coordinate of the destination region.
   * @param dirtyX - The x coordinate of the source region. Default 0.
   * @param dirtyY - The y coordinate of the source region. Default 0.
   * @param dirtyWidth - The width of the source region. Default `ImageData.width`.
   * @param dirtyHeight - The height of the source region. Default `ImageData.height`.
   * @internal
   */
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
  ): void {
    // if short call form is used, fill in the rest of the data
    dirtyX = dirtyX || 0;
    dirtyY = dirtyY || 0;
    dirtyWidth = dirtyWidth || imageData.width;
    dirtyHeight = dirtyHeight || imageData.height;

    if (
      [dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight].indexOf(Infinity) > -1
    ) {
      throw new Error(NO_INFINITY_ERROR);
    }

    if (dirtyWidth < 0 || dirtyHeight < 0) {
      throw new Error(NO_NEGATIVE_LENGTHS_ERROR);
    }

    dx = dx | 0;
    dy = dy | 0;
    let sx = dirtyX | 0;
    let sy = dirtyY | 0;
    let sw = dirtyWidth | 0;
    let sh = dirtyHeight | 0;

    // do nothing if attempting to put completely out of bounds
    if (
      dx + sw <= 0 ||
      dx >= this.$width ||
      dy + sh <= 0 ||
      dy >= this.$height
    ) {
      return;
    }

    // don't draw out of bitmap's bounds
    if (dy < 0) {
      sh += dy;
      sy -= dy;
      dy = 0;
    }

    if (dy + sh > this.$height) {
      sh = this.$height - dy;
    }

    if (dx < 0) {
      sw += dx;
      sx -= dx;
      dx = 0;
    }

    if (dx + sw > this.$width) {
      sw = this.$width - dx;
    }

    for (let y = 0; y < sh; ++y) {
      for (let x = 0; x < sw; ++x) {
        const srcIdx = (sy + y) * imageData.width + (sx + x);
        const pixel = imageData.data.subarray(
          srcIdx * RGB32,
          (srcIdx + 1) * RGB32
        );
        this._setPixel(dx + x, dy + y, pixel);
      }
    }
  }

  /**
   * Export the contents of the bitmap as a {@link NIRawImage}.
   * @public
   */
  toRawImage(): NIRawImage {
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
