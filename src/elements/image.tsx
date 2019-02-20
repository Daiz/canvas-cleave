import { NIRawImage, NodeImageBitmap } from "../imagebitmap";
import { IImage } from "../interfaces";

/**
 * @public
 */
export class NodeImage implements IImage {
  private $bitmap: NodeImageBitmap;
  private $width?: number;
  private $height?: number;
  private $complete: boolean = true;
  public src: string = "";

  get complete(): boolean {
    return this.$complete;
  }

  /**
   * @internal
   */
  get _aspectRatio(): number {
    return this.$bitmap.width / this.$bitmap.height;
  }

  get width(): number {
    if (this.$width != null) {
      return this.$width;
    } else if (this.$height != null) {
      return Math.round(this.$height * this._aspectRatio);
    } else {
      return this.$bitmap.width;
    }
  }

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

  get naturalWidth(): number {
    return this.$bitmap.width;
  }

  get naturalHeight(): number {
    return this.$bitmap.height;
  }

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

  constructor(input?: NodeImageBitmap | NIRawImage) {
    if (NodeImageBitmap.isImageBitmap(input)) {
      this.$bitmap = input;
    } else {
      this.$bitmap = new NodeImageBitmap(input);
    }
  }

  _getImageBitmap(): NodeImageBitmap {
    return this.$bitmap;
  }

  _setImageBitmap(bitmap: NodeImageBitmap): void {
    this.$bitmap = bitmap;
  }
}
