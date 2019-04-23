import { NodeImageData } from "./imagedata";

test("constructor with data argument should use given data", () => {
  const data = Uint8ClampedArray.from([255, 0, 0, 255]);
  const idata = new NodeImageData(1, 1, data);
  expect(idata.data).toBe(data);
});

test("constructor with data argument should throw if data has incorrect length", () => {
  expect(
    () => new NodeImageData(1, 1, Uint8ClampedArray.from([0, 0, 0]))
  ).toThrow();
});
