import { NodeCanvas } from "./canvas";
import { NodeDocument } from "./document";

interface DocumentGlobal extends NodeJS.Global {
  document?: any;
}
declare const global: DocumentGlobal;

test(`document.createElement("canvas") should return a NodeCanvas object`, () => {
  const document = new NodeDocument();
  const canvas = document.createElement("canvas");
  expect(canvas).toBeInstanceOf(NodeCanvas);
});

test(`NodeDocument.inject() should inject an instance of NodeDocument into the global.document key`, () => {
  expect(global.document).toBe(undefined);
  NodeDocument.inject();
  expect(global.document instanceof NodeDocument).toBe(true);
});

test(`NodeDocument.inject() should do nothing if global.document exists already`, () => {
  NodeDocument.inject();
  const document = global.document;
  NodeDocument.inject();
  expect(global.document).toBe(document);
});

test(`NodeDocument.eject() should undefine global.document if it's an instance of NodeDocument`, () => {
  NodeDocument.inject();
  NodeDocument.eject();
  expect(global.document).toBe(undefined);
});

test(`NodeDocument.eject() should do nothing if global.document exists and is not an instance of NodeDocument`, () => {
  const obj = {};
  global.document = obj;
  NodeDocument.eject();
  expect(global.document).toBe(obj);
});
