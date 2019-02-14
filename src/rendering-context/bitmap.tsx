import { NodeCanvas } from "../elements/canvas";
import { NodeImageBitmap } from "../imagebitmap";
import { IImageBitmapRenderingContext } from "../interfaces";

/**
 * @public
 */
export class NodeImageBitmapRenderingContext
  implements IImageBitmapRenderingContext {
  constructor(public readonly canvas: NodeCanvas) {}

  transferFromImageBitmap(bitmap: NodeImageBitmap): void {
    this.canvas._setImageBitmap(bitmap);
  }
}
