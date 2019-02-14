import { IDocument } from "../interfaces";
import { NodeCanvas } from "./canvas";

/**
 * @public
 */
export class NodeDocument implements IDocument {
  createElement(el: "canvas") {
    return new NodeCanvas();
  }
}
