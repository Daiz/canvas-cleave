import { NodeImageBitmap } from "../imagebitmap";
import { _NINodeCanvas } from "../imagebitmapconsumer";
import { IImageBitmapRenderingContext } from "../interfaces";

/**
 * @public
 */
export class NodeImageBitmapRenderingContext
  implements IImageBitmapRenderingContext {
  constructor(public readonly canvas: _NINodeCanvas) {}

  transferFromImageBitmap(bitmap: NodeImageBitmap): void {
    this.canvas._setImageBitmap(bitmap);
  }
}
