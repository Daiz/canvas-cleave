// @public
interface ICanvas {
    getContext(context: "bitmaprenderer"): IImageBitmapRenderingContext;
    getContext(context: "2d", options?: IRenderingContextOptions): ICanvasRenderingContext2D;
    height: number;
    width: number;
}

// @public
declare type ICanvasImageSource = ICanvas | IImage | IImageBitmap;

// @public
interface ICanvasRenderingContext2D {
    readonly canvas: ICanvas;
    drawImage(image: ICanvasImageSource, dx: number, dy: number): void;
    drawImage(image: ICanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    getImageData(sx: number, sy: number, sw: number, sh: number): IImageData;
    putImageData(data: IImageData, dx: number, dy: number): void;
    putImageData(data: IImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
}

// @public
interface IDocument {
    createElement(el: "canvas"): ICanvas;
}

// @public
interface IImage {
    readonly complete: boolean;
    height: number;
    readonly naturalHeight: number;
    readonly naturalWidth: number;
    src: string;
    width: number;
}

// @public
interface IImageBitmap {
    close(): void;
    readonly height: number;
    readonly width: number;
}

// @public
interface IImageBitmapRenderingContext {
    readonly canvas: ICanvas;
    transferFromImageBitmap(bitmap: IImageBitmap): void;
}

// @public
interface IImageData {
    readonly data: Uint8ClampedArray;
    readonly height: number;
    readonly width: number;
}

// @public
declare type IRenderingContext = ICanvasRenderingContext2D | IImageBitmapRenderingContext;

// @public
interface IRenderingContextOptions {
    alpha: boolean;
}

// @public
declare type IRenderingContextType = "bitmaprenderer" | "2d";

// @internal
declare type _NINodeCanvasImageSource = NodeCanvas | NodeImage | NodeImageBitmap;

// @public
interface NIRawImage {
    readonly data: Buffer;
    readonly info: NIRawImageInfo;
}

// @public
interface NIRawImageInfo {
    readonly channels: 1 | 2 | 3 | 4;
    readonly format: "raw";
    readonly height: number;
    readonly premultiplied: false;
    readonly size: number;
    readonly width: number;
}

// @public (undocumented)
declare class NodeCanvas implements ICanvas {
    // (undocumented)
    constructor(bitmap?: NodeImageBitmap);
    // (undocumented)
    constructor(width: number, height: number);
    // (undocumented)
    getContext(context: "bitmaprenderer"): NodeImageBitmapRenderingContext;
    // (undocumented)
    getContext(context: "2d", options?: IRenderingContextOptions): NodeCanvasRenderingContext2D;
    // (undocumented)
    _getImageBitmap(): NodeImageBitmap;
    // (undocumented)
    height: number;
    // (undocumented)
    _setImageBitmap(bitmap: NodeImageBitmap): void;
    toRawImage(): NIRawImage;
    // (undocumented)
    width: number;
}

// @public (undocumented)
declare class NodeCanvasRenderingContext2D implements ICanvasRenderingContext2D {
    // (undocumented)
    constructor(canvas: NodeCanvas);
    // (undocumented)
    readonly canvas: NodeCanvas;
    // (undocumented)
    createImageData(data: IImageData): IImageData;
    // (undocumented)
    createImageData(width: number, height: number): IImageData;
    // (undocumented)
    drawImage(image: _NINodeCanvasImageSource, dx: number, dy: number): void;
    // (undocumented)
    drawImage(image: _NINodeCanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    // (undocumented)
    getImageData(sx: number, sy: number, sw: number, sh: number): IImageData;
    // (undocumented)
    putImageData(imageData: IImageData, dx: number, dy: number): void;
    // (undocumented)
    putImageData(imageData: IImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
}

// @public (undocumented)
declare class NodeDocument implements IDocument {
    // (undocumented)
    createElement(el: "canvas"): NodeCanvas;
}

// @public (undocumented)
declare class NodeImage implements IImage {
    // (undocumented)
    constructor(bitmap?: NodeImageBitmap);
    // (undocumented)
    readonly complete: boolean;
    // (undocumented)
    _getImageBitmap(): NodeImageBitmap;
    // (undocumented)
    height: number;
    // (undocumented)
    readonly naturalHeight: number;
    // (undocumented)
    readonly naturalWidth: number;
    // (undocumented)
    src: string;
    // (undocumented)
    width: number;
}

// @public (undocumented)
declare class NodeImageBitmap implements IImageBitmap {
    // (undocumented)
    constructor(input?: NIRawImage);
    // (undocumented)
    readonly _alphaData: Uint8ClampedArray;
    // (undocumented)
    close(): void;
    // (undocumented)
    _drawImage(image: NodeImageBitmap, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    // (undocumented)
    _drawImage(image: NodeImageBitmap, dx: number, dy: number): void;
    // (undocumented)
    _drawPixel(x: number, y: number, rgb: Uint8ClampedArray, alpha?: number): void;
    // (undocumented)
    _getAlpha(x: number, y: number): number;
    // (undocumented)
    _getImageData(sx: number, sy: number, width: number, height: number): IImageData;
    // (undocumented)
    _getPixel(x: number, y: number): Uint8ClampedArray;
    // (undocumented)
    _getRGB(x: number, y: number): Uint8ClampedArray;
    // (undocumented)
    _hasAlpha: boolean;
    // (undocumented)
    readonly height: number;
    // (undocumented)
    static isImageBitmap(bitmap: any): bitmap is NodeImageBitmap;
    // (undocumented)
    readonly _isImageBitmap: true;
    // (undocumented)
    readonly _premultipliedAlpha: false;
    // (undocumented)
    _putImageData(imageData: IImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
    // (undocumented)
    _putImageData(imageData: IImageData, dx: number, dy: number): void;
    // (undocumented)
    _resize(width: number, height: number): void;
    // (undocumented)
    readonly _rgbData: Uint8ClampedArray;
    // (undocumented)
    _setAlpha(x: number, y: number, alpha: number): void;
    // (undocumented)
    _setPixel(x: number, y: number, pixel: Uint8ClampedArray): void;
    // (undocumented)
    _setRGB(x: number, y: number, r: number, g: number, b: number): void;
    // (undocumented)
    _setRGB(x: number, y: number, rgb: Uint8ClampedArray): void;
    // (undocumented)
    _toImage(): NodeImage;
    // (undocumented)
    _toRawImage(): NIRawImage;
    // (undocumented)
    readonly width: number;
}

// @public (undocumented)
declare class NodeImageBitmapRenderingContext implements IImageBitmapRenderingContext {
    // (undocumented)
    constructor(canvas: NodeCanvas);
    // (undocumented)
    readonly canvas: NodeCanvas;
    // (undocumented)
    transferFromImageBitmap(bitmap: NodeImageBitmap): void;
}


// (No @packageDocumentation comment for this package)
