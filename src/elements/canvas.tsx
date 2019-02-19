import { NIRawImage, NodeImageBitmap } from "../imagebitmap";
import {
  ICanvas,
  IRenderingContextOptions,
  IRenderingContextType
} from "../interfaces";
import { NodeImageBitmapRenderingContext } from "../rendering-context/bitmap";
import { NodeCanvasRenderingContext2D } from "../rendering-context/canvas2d";

export const DEFAULT_CANVAS_WIDTH = 0;
export const DEFAULT_CANVAS_HEIGHT = 0;

/**
 * @public
 */
export class NodeCanvas implements ICanvas {
  private $bitmap: NodeImageBitmap;

  constructor(bitmap?: NodeImageBitmap);
  constructor(width: number, height: number);
  constructor(
    widthOrBitmap: number | NodeImageBitmap = DEFAULT_CANVAS_WIDTH,
    height: number = DEFAULT_CANVAS_HEIGHT
  ) {
    if (typeof widthOrBitmap === "number") {
      this.$bitmap = new NodeImageBitmap();
      this.$bitmap._resize(widthOrBitmap, height);
    } else {
      this.$bitmap = widthOrBitmap;
    }
  }

  get width(): number {
    return this.$bitmap.width;
  }

  get height(): number {
    return this.$bitmap.height;
  }

  set width(value: number) {
    if (value < 0) value = DEFAULT_CANVAS_WIDTH;
    if (value === Infinity) value = 0;
    this.$bitmap._resize(value | 0, this.$bitmap.height);
  }

  set height(value: number) {
    if (value < 0) value = DEFAULT_CANVAS_HEIGHT;
    if (value === Infinity) value = 0;
    this.$bitmap._resize(this.$bitmap.width, value | 0);
  }

  getContext(context: "bitmaprenderer"): NodeImageBitmapRenderingContext;
  getContext(
    context: "2d",
    options?: IRenderingContextOptions
  ): NodeCanvasRenderingContext2D;
  getContext(
    context: IRenderingContextType,
    options?: IRenderingContextOptions
  ): NodeImageBitmapRenderingContext | NodeCanvasRenderingContext2D {
    switch (context) {
      case "bitmaprenderer":
        return new NodeImageBitmapRenderingContext(this);
      case "2d":
        if (options) {
          this.$bitmap._hasAlpha = options.alpha;
        }
        return new NodeCanvasRenderingContext2D(this);
    }
  }

  _getImageBitmap(): NodeImageBitmap {
    return this.$bitmap;
  }

  _setImageBitmap(bitmap: NodeImageBitmap): void {
    this.$bitmap = bitmap;
  }

  toRawImage(): NIRawImage {
    return this.$bitmap._toRawImage();
  }
}
