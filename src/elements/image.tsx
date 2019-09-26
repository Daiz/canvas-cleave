import { NodeImageBitmapConsumer } from "../imagebitmapconsumer";
import { IImage } from "../interfaces";

/**
 * A limited Node implementation for DOM HTMLImageElement.
 * @public
 */
export class NodeImage extends NodeImageBitmapConsumer implements IImage {
  private $width?: number;
  private $height?: number;
  private $complete: boolean = true;
  /**
   * The source URL of the image.
   */
  public src: string = "";

  /**
   * Is the image loaded?
   */
  get complete(): boolean {
    return this.$complete;
  }

  /**
   * The aspect ratio of the underlying bitmap.
   * @internal
   */
  get _aspectRatio(): number {
    return this.$bitmap.width / this.$bitmap.height;
  }

  /**
   * The DOM display width of the image.
   */
  get width(): number {
    if (this.$width != null) {
      return this.$width;
    } else if (this.$height != null) {
      return Math.round(this.$height * this._aspectRatio);
    } else {
      return this.$bitmap.width;
    }
  }

  /**
   * The DOM display height of the image.
   */
  get height(): number {
    if (this.$height != null) {
      return this.$height;
    } else if (this.$width != null) {
      return Math.round(this.$width / this._aspectRatio);
    } else {
      return this.$bitmap.height;
    }
  }

  set width(value: number) {
    if (value < 0 || isNaN(value) || value === Infinity) value = 0;
    this.$width = value | 0;
  }

  set height(value: number) {
    if (value < 0 || isNaN(value) || value === Infinity) value = 0;
    this.$height = value | 0;
  }
  /**
   * The actual width of the image.
   */
  get naturalWidth(): number {
    return this.$bitmap.width;
  }
  /**
   * The actual height of the image.
   */
  get naturalHeight(): number {
    return this.$bitmap.height;
  }
  /**
   * Unset the DOM width and height parameters.
   * @param attr - The name of the attribute to remove. "width" or "height".
   * @public
   */
  removeAttribute(attr: "width" | "height"): void {
    switch (attr) {
      case "width":
        this.$width = undefined;
        break;
      case "height":
        this.$height = undefined;
        break;
    }
  }
}
