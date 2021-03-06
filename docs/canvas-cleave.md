<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [canvas-cleave](./canvas-cleave.md)

## canvas-cleave package

## Classes

|  Class | Description |
|  --- | --- |
|  [NodeCanvas](./canvas-cleave.nodecanvas.md) | A limited Node implementation for DOM HTMLCanvasElement. |
|  [NodeCanvasRenderingContext2D](./canvas-cleave.nodecanvasrenderingcontext2d.md) | A limited Node implementation for DOM CanvasRenderingContext2D. |
|  [NodeDocument](./canvas-cleave.nodedocument.md) | A limited Node implementation for the DOM Document to enable cross-environment creation of <code>canvas</code> elements using <code>document.createElement(&quot;canvas&quot;)</code>. |
|  [NodeImage](./canvas-cleave.nodeimage.md) | A limited Node implementation for DOM HTMLImageElement. |
|  [NodeImageBitmap](./canvas-cleave.nodeimagebitmap.md) | A Node implementation for DOM ImageBitmap. |
|  [NodeImageBitmapConsumer](./canvas-cleave.nodeimagebitmapconsumer.md) | Abstract class to base [NodeImageBitmap](./canvas-cleave.nodeimagebitmap.md) consumers on. |
|  [NodeImageData](./canvas-cleave.nodeimagedata.md) | A Node implementation of DOM ImageData. |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [ICanvas](./canvas-cleave.icanvas.md) | A cross-environment interface for canvas objects that covers the properties and methods supported by both DOM (as HTMLCanvasElement) and canvas-cleave (as NodeCanvas). |
|  [ICanvasRenderingContext2D](./canvas-cleave.icanvasrenderingcontext2d.md) | A cross-environment interface for 2D canvas rendering context objects that covers the properties and methods supported by both DOM (as CanvasRenderingContext2D) and canvas-cleave (as NodeCanvasRenderingContext2D) |
|  [IDocument](./canvas-cleave.idocument.md) | A cross-environment interface that covers the method supported by both DOM (as document) and canvas-cleave (as document). |
|  [IImage](./canvas-cleave.iimage.md) | A cross-environment interface for image objects that covers the properties supported by both DOM (as HTMLImageElement) and canvas-cleave (as NodeImage). |
|  [IImageBitmap](./canvas-cleave.iimagebitmap.md) | A cross-environment interface for image bitmap objects that covers the properties and methods supported by both DOM (as ImageBitmap) and canvas-cleave (as NodeImageBitmap). |
|  [IImageBitmapRenderingContext](./canvas-cleave.iimagebitmaprenderingcontext.md) | A cross-environment interface for canvas image bitmap rendering context objects that covers the properties and methods supported by both DOM (as ImageBitmapRenderingContext) and canvas-cleave (as NodeImageBitmapRenderingContext) |
|  [IImageData](./canvas-cleave.iimagedata.md) | A cross-environment interface for image data objects that covers the properties supported by both DOM (as ImageData) and canvas-cleave (as NodeImageData). |
|  [IRenderingContextOptions](./canvas-cleave.irenderingcontextoptions.md) | A cross-environment interface that covers the properties supported for options when requesting a 2D canvas rendering context in both DOM (in HTMLCanvasElement.getContext) and canvas-cleave (in NodeCanvas.getContext). |
|  [NIRawImage](./canvas-cleave.nirawimage.md) | Node interface for passing around raw image data. |
|  [NIRawImageInfo](./canvas-cleave.nirawimageinfo.md) | Node interface for raw image information. |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [ICanvasImageSource](./canvas-cleave.icanvasimagesource.md) | A cross-environment type that covers the supported image source input types of the canvas.drawImage function in both DOM (in HTMLCanvasElement) and canvas-cleave (in NodeCanvas). |
|  [IRenderingContext](./canvas-cleave.irenderingcontext.md) | A cross-environment type that covers the types of canvas rendering contexts returned by the supported canvas.getContext calls. |
|  [NINodeCanvas](./canvas-cleave.ninodecanvas.md) | Type definition for canvas-cleave's Canvas implementation. |
|  [NINodeCanvasImageSource](./canvas-cleave.ninodecanvasimagesource.md) | Node interface for [NodeCanvasRenderingContext2D](./canvas-cleave.nodecanvasrenderingcontext2d.md) input image type support. |
|  [NINodeImage](./canvas-cleave.ninodeimage.md) | Type definition for canvas-cleave's Image implementation. |

