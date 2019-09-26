import { NodeImageBitmapConsumer } from "../imagebitmapconsumer";
import { ICanvas, IRenderingContextOptions } from "../interfaces";
import { NodeCanvasRenderingContext2D } from "../rendering-context/canvas2d";

export const DEFAULT_CANVAS_WIDTH = 0;
export const DEFAULT_CANVAS_HEIGHT = 0;

/**
 * A limited Node implementation for DOM HTMLCanvasElement.
 * @public
 */
export class NodeCanvas extends NodeImageBitmapConsumer implements ICanvas {
  /**
   * {@inheritDoc ICanvas.width}
   */
  get width(): number {
    return this.$bitmap.width;
  }

  /**
   * {@inheritDoc ICanvas.height}
   */
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

  /**
   * {@inheritDoc ICanvas.getContext}
   */
  getContext(
    context: "2d",
    options?: IRenderingContextOptions
  ): NodeCanvasRenderingContext2D {
    if (options) {
      this.$bitmap._hasAlpha = options.alpha;
    }
    return new NodeCanvasRenderingContext2D(this);
  }
}
