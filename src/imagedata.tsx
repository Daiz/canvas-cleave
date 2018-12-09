// bytes (uint8) per pixel
const BYTES_IN_RGB24 = 3;

export class ImageData {
  width: number = 0;
  height: number = 0;
  data: Buffer | null = null;

  constructor(width: number = 0, height: number = 0) {
    this._resize(width, height);
  }

  // non-standard methods for functional shimming purposes

  _toBuffer() {
    return this.data || Buffer.from([]);
  }

  _putImageData(width: number, height: number, buffer: Buffer) {
    this.width = width;
    this.height = height;
    this.data = buffer;
  }

  _resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    const size = width * height * 4;
    if (size > 0) this.data = Buffer.alloc(width * height * 4);
    else this.data = null;
  }

  _unload() {
    this._resize(0, 0);
  }

  private getPosition(x: number, y: number) {
    if (x < 0) x = this.width - x;
    if (y < 0) y = this.height - y;
    if (x < 0 || x > this.width || y < 0 || y > this.height) {
      throw new Error("Requested pixel out of bounds.");
    }
    const target = (y * this.width + x) * BYTES_IN_RGB24;
    return { x, y, target };
  }

  _getPixel(xx: number, yy: number): Buffer {
    const { target } = this.getPosition(xx, yy);
    if (this.data) {
      return this.data.slice(target, target + BYTES_IN_RGB24);
    } else {
      throw new Error("No pixel data available.");
    }
  }

  _setPixel(xx: number, yy: number, px: Buffer) {
    const { target } = this.getPosition(xx, yy);
    if (px.length !== BYTES_IN_RGB24) {
      throw new Error("Invalid pixel data provided. Must be exactly 4 bytes.");
    }
    if (this.data) {
      this.data.set(px, target);
    } else {
      // fails silently
    }
  }
}
