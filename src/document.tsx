import { NodeCanvas } from "./canvas";
import { IDocument } from "./interfaces";

export const document: IDocument = {
  createElement(el: "canvas") {
    return new NodeCanvas();
  }
};
