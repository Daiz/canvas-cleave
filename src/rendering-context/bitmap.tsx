import { NodeCanvas } from "../elements/canvas";
import { NodeImageBitmap } from "../imagebitmap";
import { IImageBitmapRenderingContext } from "../interfaces";

export class NodeImageBitmapRenderingContext
  implements IImageBitmapRenderingContext {
  constructor(public readonly canvas: NodeCanvas) {}

  transferFromImageBitmap(bitmap: NodeImageBitmap) {
    this.canvas._setImageBitmap(bitmap);
  }
}
