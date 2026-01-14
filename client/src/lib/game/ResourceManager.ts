export class ResourceManager {
  private static images: { [key: string]: HTMLImageElement } = {};

  static loadImage(src: string): HTMLImageElement {
    if (this.images[src]) {
      return this.images[src];
    }

    const img = new Image();
    img.src = src;
    this.images[src] = img;
    return img;
  }

  static getImage(src: string): HTMLImageElement | undefined {
    return this.images[src];
  }
}
