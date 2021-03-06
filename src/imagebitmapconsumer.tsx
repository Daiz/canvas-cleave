import { NIRawImage, NodeImageBitmap } from "./imagebitmap";
import { ICanvas, IImage } from "./interfaces";

/**
 * Type definition for canvas-cleave's Canvas implementation.
 * @public
 */
export type NINodeCanvas = ICanvas & NodeImageBitmapConsumer;

/**
 * Type definition for canvas-cleave's Image implementation.
 * @public
 */
export type NINodeImage = IImage & NodeImageBitmapConsumer;

/**
 * Abstract class to base {@link NodeImageBitmap} consumers on.
 * @public
 */
export abstract class NodeImageBitmapConsumer {
  /**
   * The underlying image bitmap of the consumer.
   */
  protected $bitmap: NodeImageBitmap;

  /**
   * Create a new bitmap consumer.
   * @param input - Input value for initializing the consumer's bitmap.
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
   * Set the underlying bitmap of the consumer.
   * @param bitmap - The bitmap to set the consumer's internal bitmap to.
   * @internal
   */
  _setImageBitmap(bitmap: NodeImageBitmap): void {
    this.$bitmap = bitmap;
  }

  /**
   * Export the contents of the underlying bitmap as a {@link NIRawImage}.
   */
  toRawImage(): NIRawImage {
    return this.$bitmap.toRawImage();
  }
}
