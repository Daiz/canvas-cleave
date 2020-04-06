<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [canvas-cleave](./canvas-cleave.md) &gt; [ICanvasRenderingContext2D](./canvas-cleave.icanvasrenderingcontext2d.md) &gt; [putImageData](./canvas-cleave.icanvasrenderingcontext2d.putimagedata_1.md)

## ICanvasRenderingContext2D.putImageData() method

Replace a region of the canvas with a region of the supplied ImageData.

<b>Signature:</b>

```typescript
putImageData(data: IImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  data | <code>IImageData</code> | The ImageData to use for the replacement. |
|  dx | <code>number</code> | The x coordinate of the destination region. |
|  dy | <code>number</code> | The y coordinate of the destination region. |
|  dirtyX | <code>number</code> | The x coordinate of the source region. Default 0. |
|  dirtyY | <code>number</code> | The y coordinate of the source region. Default 0. |
|  dirtyWidth | <code>number</code> | The width of the source region. Default <code>ImageData.width</code>. |
|  dirtyHeight | <code>number</code> | The height of the source region. Default <code>ImageData.height</code>. |

<b>Returns:</b>

`void`
