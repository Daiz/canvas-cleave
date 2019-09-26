import { ICanvas, ICanvasImageSource, IDocument, IImage } from "../src/interfaces";

interface IDimensions {
  width: number;
  height: number;
}

declare const document: IDocument;

function getDimensions(image: ICanvasImageSource): IDimensions {
  return (image as any).naturalWidth != null
    ? {
      width: (image as IImage).naturalWidth,
      height: (image as IImage).naturalHeight
    }
    : { width: image.width, height: image.height };
}

type VerticalAlign = "top" | "middle" | "bottom";

/**
 * Tile images from left to right.
 * @param canvas - The canvas to tile the images on.
 * @param images - The array of canvas image sources.
 * @param verticalAlign - Vertical alignment of images to tile. Default "middle".
 * @param gap - The gap to leave between images in pixels. Default 0.
 */
export function tileRight(
  images: ICanvasImageSource[],
  verticalAlign: VerticalAlign = "middle",
  gap: number = 0
): ICanvas {
  const canvas = document.createElement("canvas");
  const canvasWidth = images.reduce(
    (sum, image) => sum + getDimensions(image).width + gap,
    0 - gap
  );
  const canvasHeight = Math.max(
    ...images.map(image => getDimensions(image).height)
  );

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext("2d");

  const positions: number[] = [];
  let current = 0;
  for (let i = 0; i < images.length; ++i) {
    const image = images[i];
    positions[i] = current;
    current += getDimensions(image).width + gap;
  }

  images.forEach((image, index) => {
    const x = positions[index];
    const { height } = getDimensions(image);
    let y = 0;
    switch (verticalAlign) {
      case "middle":
        y = Math.floor((canvasHeight - height) / 2);
        break;
      case "bottom":
        y = canvasHeight - height;
        break;
    }
    ctx.drawImage(image, x, y);
  });

  return canvas;
}
/**
 * Overlay an image on a canvas. Defaults to centering the overlay.
 * @param canvas - The canvas to use.
 * @param overlay - The overlay image.
 * @param background - Optionally replace canvas contents with this image first.
 * @param dx - Optional overlay X coordinate.
 * @param dy - Optional overlay Y coordinate.
 */
export function overlay(
  overlay: ICanvasImageSource,
  background?: ICanvasImageSource,
  dx?: number,
  dy?: number
): ICanvas {
  const canvas = document.createElement("canvas");
  if (background) {
    const { width, height } = getDimensions(background);
    canvas.width = width;
    canvas.height = height;
  }

  const { width, height } = getDimensions(overlay);

  const ctx = canvas.getContext("2d");

  if (ctx) {
    if (background) ctx.drawImage(background, 0, 0);
    const x = dx == null ? Math.round(canvas.width / 2 - width / 2) : dx;
    const y = dy == null ? Math.round(canvas.height / 2 - height / 2) : dy;
    ctx.drawImage(overlay, x, y);
  }

  return canvas;
}
