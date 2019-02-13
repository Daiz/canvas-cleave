import { NodeImageBitmap } from "./imagebitmap";
import {
  ICanvas,
  IRenderingContextOptions,
  IRenderingContextType
} from "./interfaces";
import { NodeImageBitmapRenderingContext } from "./rendering-context/bitmap";
import { NodeCanvasRenderingContext2D } from "./rendering-context/canvas2d";

export class NodeCanvas implements ICanvas {
  private $bitmap: NodeImageBitmap;

  constructor(bitmap: NodeImageBitmap);
  constructor(width?: number, height?: number);
  constructor(widthOrBitmap: number | NodeImageBitmap = 0, height = 0) {
    if (typeof widthOrBitmap === "number") {
      this.$bitmap = new NodeImageBitmap();
      this.$bitmap._resize(widthOrBitmap, height);
    } else {
      this.$bitmap = widthOrBitmap;
    }
  }

  get width() {
    return this.$bitmap.width;
  }

  get height() {
    return this.$bitmap.height;
  }

  set width(value: number) {
    this.$bitmap._resize(value, this.$bitmap.height);
  }

  set height(value: number) {
    this.$bitmap._resize(this.$bitmap.width, value);
  }

  getContext(context: "bitmaprenderer"): NodeImageBitmapRenderingContext;
  getContext(
    context: "2d",
    options?: IRenderingContextOptions
  ): NodeCanvasRenderingContext2D;
  getContext(
    context: IRenderingContextType,
    options?: IRenderingContextOptions
  ) {
    switch (context) {
      case "bitmaprenderer":
        return new NodeImageBitmapRenderingContext(this);
      case "2d":
        if (options) {
          this.$bitmap._hasAlpha = options.alpha;
        }
        return new NodeCanvasRenderingContext2D(this);
    }
    console.log("this code should be unreachable?");
  }

  // non-standard methods for functional shimming purposes
  _setImageBitmap(bitmap: NodeImageBitmap) {
    this.$bitmap = bitmap;
  }
  _getImageBitmap() {
    return this.$bitmap;
  }
  _toRawImage() {
    return this.$bitmap._toRawImage();
  }
}
