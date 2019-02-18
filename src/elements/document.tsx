import { IDocument } from "../interfaces";
import { NodeCanvas } from "./canvas";

interface DocumentGlobal extends NodeJS.Global {
  document?: NodeDocument;
}
declare const global: DocumentGlobal;

/**
 * @public
 */
export class NodeDocument implements IDocument {
  createElement(el: "canvas"): NodeCanvas {
    return new NodeCanvas();
  }
  static inject(): void {
    global.document = global.document || new NodeDocument();
  }
  static eject(): void {
    if (global.document instanceof NodeDocument) {
      global.document = undefined;
    }
  }
}
