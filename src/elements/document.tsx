import { IDocument } from "../interfaces";
import { NodeCanvas } from "./canvas";

interface DocumentGlobal extends NodeJS.Global {
  document?: NodeDocument;
}
declare const global: DocumentGlobal;

/**
 * A minimal Node implementation for the DOM Document object to enable cross-environment creation of `canvas` elements using `document.createElement("canvas")`.
 * @public
 */
export class NodeDocument implements IDocument {
  /**
   * Create an element. Only "canvas" is supported by this implementation.
   * @param el The name of the element to be created. Must be "canvas".
   */
  createElement(el: "canvas"): NodeCanvas {
    return new NodeCanvas();
  }

  /**
   * Injects an instance of NodeDocument into the global object as "document" if one doesn't exist already (ie. it does nothing in the browser nor on subsequent calls).
   * @public
   */
  static inject(): void {
    global.document = global.document || new NodeDocument();
  }

  /**
   * Reverses the NodeDocument injection from {@link NodeDocument.inject} by undefining the global.document variable if it's an instance of {@link NodeDocument}.
   * @public
   */
  static eject(): void {
    if (global.document instanceof NodeDocument) {
      global.document = undefined;
    }
  }
}
