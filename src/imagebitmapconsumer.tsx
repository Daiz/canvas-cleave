import { NIRawImage, NodeImageBitmap } from "./imagebitmap";
import { ICanvas, IImage } from "./interfaces";

/**
 * @internal
 */
export type _NINodeCanvas = ICanvas & _NodeImageBitmapConsumer;

/**
 * @internal
 */
export type _NINodeImage = IImage & _NodeImageBitmapConsumer;

/**
 * @internal
 */
export abstract class _NodeImageBitmapConsumer {
  protected $bitmap: NodeImageBitmap;

  /**
   * Create a new bitmap consumer.
   * @param input Input value for initializing the consumer's bitmap.
   */
  constructor(input?: NodeImageBitmap | NIRawImage) {
    if (NodeImageBitmap.isImageBitmap(input)) {
      this.$bitmap = input;
    } else {
      this.$bitmap = new NodeImageBitmap(input);
    }
  }

  /**
   * Return the underlying bitmap of the consumer.
   * @internal
   */
  _getImageBitmap(): NodeImageBitmap {
    return this.$bitmap;
  }

  /**
   * @param bitmap The bitmap to set the consumer's internal bitmap to.
   * @internal
   */
  _setImageBitmap(bitmap: NodeImageBitmap): void {
    this.$bitmap = bitmap;
  }

  toRawImage(): NIRawImage {
    return this.$bitmap._toRawImage();
  }
}
