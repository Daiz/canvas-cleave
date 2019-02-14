import { NodeCanvas } from "./canvas";
import { NodeDocument } from "./document";

test(`document.createElement("canvas") should return a NodeCanvas object`, () => {
  const document = new NodeDocument();
  const canvas = document.createElement("canvas");
  expect(canvas).toBeInstanceOf(NodeCanvas);
});
