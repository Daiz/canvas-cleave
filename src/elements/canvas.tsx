import { _NodeImageBitmapConsumer } from "../imagebitmapconsumer";
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
export class NodeCanvas extends _NodeImageBitmapConsumer implements ICanvas {
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
}
