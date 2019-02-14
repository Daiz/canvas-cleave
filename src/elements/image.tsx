import { NodeImageBitmap } from "../imagebitmap";
import { IImage } from "../interfaces";

/**
 * @public
 */
export class NodeImage implements IImage {
  private $bitmap: NodeImageBitmap;
  private $width: number = 0;
  private $height: number = 0;
  private $complete: boolean = true;
  public src: string = "";

  get complete(): boolean {
    return this.$complete;
  }

  get width(): number {
    return this.$width || this.$bitmap.width;
  }

  get height(): number {
    return this.$height || this.$bitmap.height;
  }

  set width(value: number) {
    this.$width = value;
  }

  set height(value: number) {
    this.$height = value;
  }

  get naturalWidth(): number {
    return this.$bitmap.width;
  }

  get naturalHeight(): number {
    return this.$bitmap.height;
  }

  constructor(bitmap?: NodeImageBitmap) {
    this.$bitmap = bitmap || new NodeImageBitmap();
  }

  _getImageBitmap(): NodeImageBitmap {
    return this.$bitmap;
  }
}
