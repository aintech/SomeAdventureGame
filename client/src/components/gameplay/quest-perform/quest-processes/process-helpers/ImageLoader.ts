import GoblinImgSrc from "../../../../../img/quest-perform/battle-process/actors/goblin.png";
import GoblinPrtImgSrc from "../../../../../img/quest-perform/battle-process/actors/goblin-prt.png";
import SnakeImgSrc from "../../../../../img/quest-perform/battle-process/actors/snake.png";
import SnakePrtImgSrc from "../../../../../img/quest-perform/battle-process/actors/snake-prt.png";
import MothImgSrc from "../../../../../img/quest-perform/battle-process/actors/moth.png";
import MothPrtImgSrc from "../../../../../img/quest-perform/battle-process/actors/moth-prt.png";
import AttackGifSrc from "../../../../../img/quest-perform/battle-process/attack.gif";
import ChestClosedImgSrc from "../../../../../img/quest-perform/treasure-process/treasure__chest_closed.png";
import ChestOpenedImgSrc from "../../../../../img/quest-perform/treasure-process/treasure__chest_opened.png";
import ResultBackImgSrc from "../../../../../img/quest-perform/quest-process-result/result__background.png";
import ResultGoldImgSrc from "../../../../../img/quest-perform/quest-process-result/result__gold_icon.png";
import EnergyDropImgSrc from "../../../../../img/quest-perform/energy-drop.png";
import Gif from "../../../../../utils/Gif";
import GifLoader from "../../../../../utils/gif-loader";

export enum ImageType {
  SNAKE,
  GOBLIN,
  MOTH,

  ATTACK,

  CHEST_CLOSED,
  CHEST_OPENED,

  RESULT_BACK,
  RESULT_GOLD,

  ENERGY_DROP,
}

const gifs: Map<ImageType, Gif> = new Map();
export const getGifs = async (types: ImageType[]) => {
  const absentGifs = types.filter((type) => !gifs.has(type));
  const loaders = absentGifs.map((type) => loadGif(type));
  loaders.forEach((l) => l.then((d) => gifs.set(d.type, d.gif)));
  await Promise.all([...loaders]);
  return gifs;
};

const images: Map<ImageType, HTMLImageElement> = new Map();
export const getImages = async (types: ImageType[]) => {
  const absentImgs = types.filter((type) => !images.has(type));
  const loaders = absentImgs.map((type) => loadImage(type));
  loaders.forEach((l) => l.then((d) => images.set(d.type, d.img)));
  await Promise.all([...loaders]);
  return images;
};

type GifData = {
  type: ImageType;
  gif: Gif;
};

//FIXME: заменить gif-reader на
// https://stackoverflow.com/a/48323003
// https://github.com/rfrench/gify
// https://www.npmjs.com/package/jdataview
// или научиться парсить на сервере и возвращать распарсеную информацию
const loadGif = (type: ImageType): Promise<GifData> => {
  const loader = GifLoader();
  loader.load(getUrlByType(type));
  return new Promise<GifData>((resolve, _) => {
    loader.onload = (event: any) => {
      resolve({ type, gif: event.path[0] });
    };
  });
};

type ImageData = {
  type: ImageType;
  img: HTMLImageElement;
};

const loadImage = (type: ImageType): Promise<ImageData> => {
  const image = new Image();
  image.src = getUrlByType(type);
  return new Promise<ImageData>((resolve, _) => {
    image.onload = (event: Event) => {
      resolve({ type, img: event.currentTarget as HTMLImageElement });
    };
  });
};

export const getUrlByType = (type: ImageType) => {
  switch (type) {
    case ImageType.SNAKE:
      return SnakeImgSrc;
    case ImageType.GOBLIN:
      return GoblinImgSrc;
    case ImageType.MOTH:
      return MothImgSrc;
    case ImageType.ATTACK:
      return AttackGifSrc;
    case ImageType.CHEST_CLOSED:
      return ChestClosedImgSrc;
    case ImageType.CHEST_OPENED:
      return ChestOpenedImgSrc;
    case ImageType.RESULT_BACK:
      return ResultBackImgSrc;
    case ImageType.RESULT_GOLD:
      return ResultGoldImgSrc;
    case ImageType.ENERGY_DROP:
      return EnergyDropImgSrc;
    default:
      throw new Error(`Tyimg fetch url for unknown type ${ImageType[type]}`);
  }
};

export const getTypeByName = (name: string) => {
  switch (name) {
    case "snake":
      return ImageType.SNAKE;
    case "goblin":
      return ImageType.GOBLIN;
    case "moth":
      return ImageType.MOTH;
    default:
      throw new Error(`Tyimg fetch url for unknown name ${name}`);
  }
};

export const getUrlByName = (name: string) => {
  switch (name) {
    case "snake-prt":
      return SnakePrtImgSrc;
    case "goblin-prt":
      return GoblinPrtImgSrc;
    case "moth-prt":
      return MothPrtImgSrc;
    default:
      throw new Error(`Tyimg fetch url for unknown name ${name}`);
  }
};
