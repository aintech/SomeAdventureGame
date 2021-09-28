import Gif from "../../../../../utils/Gif";

class DrawData {
  private _rotation: number = 0;
  private _image?: HTMLImageElement;
  private _gif?: Gif;
  private _width: number;
  private _height: number;

  constructor(public img?: HTMLImageElement, gif?: Gif, public rotatePerFrame: number = 0) {
    this._image = img;
    this._gif = gif;
    this._width = img?.width ?? gif!.image.width;
    this._height = img?.height ?? gif!.image.height;
  }

  public rotate() {
    this._rotation = (this._rotation + this.rotatePerFrame) % 360;
  }

  public rotation() {
    return this._rotation;
  }

  public image() {
    return this._image ?? this._gif!.image;
  }

  public width() {
    return this._width;
  }

  public height() {
    return this._height;
  }

  public raw() {
    return this._image ?? this._gif!;
  }
}

export default DrawData;
