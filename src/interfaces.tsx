export interface IImage {
  readonly naturalWidth: number;
  readonly naturalHeight: number;
  width: number;
  height: number;
  readonly complete: boolean;
  src: string;
}

export interface IImageBitmap {
  readonly width: number;
  readonly height: number;
  close(): void;
}

export interface IImageData {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8ClampedArray;
}

export type ICanvasImageSource = ICanvas | IImage | IImageBitmap;

export type IRenderingContextType = "bitmaprenderer" | "2d";

export interface IDocument {
  createElement(el: "canvas"): ICanvas;
}

export interface IRenderingContextOptions {
  alpha: boolean;
}

export interface ICanvas {
  width: number;
  height: number;
  getContext(context: "bitmaprenderer"): IImageBitmapRenderingContext;
  getContext(
    context: "2d",
    options?: IRenderingContextOptions
  ): ICanvasRenderingContext2D;
}

export interface ICanvasRenderingContext2D {
  readonly canvas: ICanvas;
  drawImage(image: ICanvasImageSource, dx: number, dy: number): void;
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
  getImageData(sx: number, sy: number, sw: number, sh: number): IImageData;
  putImageData(data: IImageData, dx: number, dy: number): void;
  putImageData(
    data: IImageData,
    dx: number,
    dy: number,
    dirtyX: number,
    dirty: number,
    dirtyWidth: number,
    dirtyHeight: number
  ): void;
}

export interface IImageBitmapRenderingContext {
  readonly canvas: ICanvas;
  transferFromImageBitmap(bitmap: IImageBitmap): void;
}

export type IRenderingContext =
  | ICanvasRenderingContext2D
  | IImageBitmapRenderingContext;
