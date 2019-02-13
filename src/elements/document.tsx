import { IDocument } from "../interfaces";
import { NodeCanvas } from "./canvas";

export const document: IDocument = {
  createElement(el: "canvas") {
    return new NodeCanvas();
  }
};
