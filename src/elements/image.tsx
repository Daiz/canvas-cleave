import { NodeImageBitmap } from "../imagebitmap";
import { IImage } from "../interfaces";

export function isImage(image: any): image is IImage {
  if (image.naturalWidth && image.naturalHeight) return true;
  return false;
}

export class NodeImage implements IImage {
  private $bitmap: NodeImageBitmap;
  private $width: number = 0;
  private $height: number = 0;
  private $complete: boolean = true;
  public src: string = "";

  get complete() {
    return this.$complete;
  }

  get width() {
    return this.$width || this.$bitmap.width;
  }

  get height() {
    return this.$height || this.$bitmap.height;
  }

  set width(value: number) {
    this.$width = value;
  }

  set height(value: number) {
    this.$height = value;
  }

  get naturalWidth() {
    return this.$bitmap.width;
  }

  get naturalHeight() {
    return this.$bitmap.height;
  }

  constructor(bitmap?: NodeImageBitmap) {
    this.$bitmap = bitmap || new NodeImageBitmap();
  }

  _getImageBitmap() {
    return this.$bitmap;
  }
}
