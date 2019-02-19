/**
 * A cross-environment interface for image objects that covers the properties supported by both DOM (as HTMLImageElement) and canvas-cleave (as NodeImage).
 * @public
 */
export interface IImage {
  /**
   * The actual width of the image.
   */
  readonly naturalWidth: number;
  /**
   * The actual height of the image.
   */
  readonly naturalHeight: number;
  /**
   * The DOM display width of the image.
   */
  width: number;
  /**
   * The DOM display height of the image.
   */
  height: number;
  /**
   * Unset the DOM width and height parameters.
   * @param attr - The name of the attribute to remove. "width" or "height".
   */
  removeAttribute(attr: "width" | "height"): void;
  /**
   * Is the image loaded?
   */
  readonly complete: boolean;
  /**
   * The source URL of the image.
   */
  src: string;
}

/**
 * A cross-environment interface for image bitmap objects that covers the properties and methods supported by both DOM (as ImageBitmap) and canvas-cleave (as NodeImageBitmap).
 * @public
 */
export interface IImageBitmap {
  /**
   * The width of the image bitmap.
   */
  readonly width: number;
  /**
   * The height of the image bitmap.
   */
  readonly height: number;
  /**
   * Disposes of the data associated with this image bitmap. The bitmap cannot be used afterwards.
   */
  close(): void;
}

/**
 * A cross-environment interface for image data objects that covers the properties supported by both DOM (as ImageData) and canvas-cleave (no specific class).
 * @public
 */
export interface IImageData {
  /**
   * The width of the image data in pixels.
   */
  readonly width: number;
  /**
   * The height of the image data in pixels.
   */
  readonly height: number;
  /**
   * The actual RGB32 image data. The length of the data is width * height * 4 (bytes per pixel).
   */
  readonly data: Uint8ClampedArray;
}

/**
 * A cross-environment type that covers the supported image source input types of the canvas.drawImage function in both DOM (in HTMLCanvasElement) and canvas-cleave (in NodeCanvas).
 * @public
 */
export type ICanvasImageSource = ICanvas | IImage | IImageBitmap;

/**
 * A cross-environment type that covers the supported canvas rendering context types of the canvas.getContext function in both DOM (in HTMLCanvasElement) and canvas-cleave (in NodeCanvas).
 * @public
 */
export type IRenderingContextType = "bitmaprenderer" | "2d";

/**
 * A cross-environment interface that covers the method supported by both DOM (as document) and canvas-cleave (as document).
 * @public
 */
export interface IDocument {
  /**
   * Create an element. Only "canvas" is supported by both DOM and canvas-cleave.
   * @param el - The name of the element to create.
   */
  createElement(el: "canvas"): ICanvas;
}

/**
 * A cross-environment interface that covers the properties supported for options when requesting a 2D canvas rendering context in both DOM (in HTMLCanvasElement.getContext) and canvas-cleave (in NodeCanvas.getContext).
 * @public
 */
export interface IRenderingContextOptions {
  /**
   * Enable/disable alpha channel for the canvas depending on your needs.
   */
  alpha: boolean;
}

/**
 * A cross-environment interface for canvas objects that covers the properties and methods supported by both DOM (as HTMLCanvasElement) and canvas-cleave (as NodeCanvas).
 * @public
 */
export interface ICanvas {
  /**
   * The width of the canvas.
   */
  width: number;
  /**
   * The height of the canvas.
   */
  height: number;
  /**
   * Get a image bitmap rendering context for the canvas.
   * @param context - The context to request.
   */
  getContext(context: "bitmaprenderer"): IImageBitmapRenderingContext;
  /**
   * Get a 2D rendering context for the canvas.
   * @param context - The context to request.
   * @param options - Optional options for the context.
   */
  getContext(
    context: "2d",
    options?: IRenderingContextOptions
  ): ICanvasRenderingContext2D;
}

/**
 * A cross-environment interface for 2D canvas rendering context objects that covers the properties and methods supported by both DOM (as CanvasRenderingContext2D) and canvas-cleave (as NodeCanvasRenderingContext2D)
 * @public
 */
export interface ICanvasRenderingContext2D {
  /**
   * Reference to the canvas that this rendering context is for.
   */
  readonly canvas: ICanvas;
  /**
   * Draw an image to the canvas at the specified coordinates.
   * @param image - The image to draw.
   * @param dx - The x coordinate to draw the image to.
   * @param dy - The y coordinate to draw the image to.
   */
  drawImage(image: ICanvasImageSource, dx: number, dy: number): void;
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
   */
  drawImage(
    image: ICanvasImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void;
  /**
   * Get ImageData for the defined region of the canvas.
   * @param sx - The x coordinate of the region.
   * @param sy - The y coordiante of the region.
   * @param sw - The width of the region. Can be negative to extend left.
   * @param sh - The height of the region. Can be negative to extend up.
   */
  getImageData(sx: number, sy: number, sw: number, sh: number): IImageData;
  /**
   * Replace a region of the canvas with the supplied ImageData.
   * @param data - The ImageData to use for the replacement.
   * @param dx - The x coordinate of the region.
   * @param dy - The y coordinate of the region.
   */
  putImageData(data: IImageData, dx: number, dy: number): void;
  /**
   * Replace a region of the canvas with a region of the supplied ImageData.
   * @param data - The ImageData to use for the replacement.
   * @param dx - The x coordinate of the destination region.
   * @param dy - The y coordinate of the destination region.
   * @param dirtyX - The x coordinate of the source region. Default 0.
   * @param dirtyY - The y coordinate of the source region. Default 0.
   * @param dirtyWidth - The width of the source region. Default `ImageData.width`.
   * @param dirtyHeight - The height of the source region. Default `ImageData.height`.
   */
  putImageData(
    data: IImageData,
    dx: number,
    dy: number,
    dirtyX: number,
    dirtyY: number,
    dirtyWidth: number,
    dirtyHeight: number
  ): void;
}

/**
 * A cross-environment interface for canvas image bitmap rendering context objects that covers the properties and methods supported by both DOM (as ImageBitmapRenderingContext) and canvas-cleave (as NodeImageBitmapRenderingContext)
 * @public
 */
export interface IImageBitmapRenderingContext {
  /**
   * Reference to the canvas that this rendering context is for.
   */
  readonly canvas: ICanvas;
  /**
   * Replace the contents of the canvas with the contents of an image bitmap.
   * @param bitmap - The bitmap to replace the canvas contents with.
   */
  transferFromImageBitmap(bitmap: IImageBitmap): void;
}

/**
 * A cross-environment type that covers the types of canvas rendering contexts returned by the supported canvas.getContext calls.
 * @public
 */
export type IRenderingContext =
  | ICanvasRenderingContext2D
  | IImageBitmapRenderingContext;
