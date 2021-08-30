import { Gif } from "../../../../../utils/gif-reader";
import CrabGifSrc from "../../../../../img/quest-process-display/actors/crab.gif";
import HeroGifSrc from "../../../../../img/quest-process-display/actors/hero.gif";
import PlantGifSrc from "../../../../../img/quest-process-display/actors/plant.gif";
import SlimeGifSrc from "../../../../../img/quest-process-display/actors/slime.gif";
import SpiderGifSrc from "../../../../../img/quest-process-display/actors/spider.gif";
import ZombieGifSrc from "../../../../../img/quest-process-display/actors/zombie.gif";
import GravestoneImgSrc from "../../../../../img/quest-process-display/gravestone.png";
import RewardBackImgSrc from "../../../../../img/quest-process-display/reward-back.png";
import RewardGoldImgSrc from "../../../../../img/quest-process-display/reward-gold.png";
import ChestClosedImgSrc from "../../../../../img/quest-process-display/chest-closed.png";
import ChestOpenImgSrc from "../../../../../img/quest-process-display/chest-open.png";

export enum ImageType {
  HERO,

  CRAB,
  PLANT,
  SLIME,
  SPIDER,
  ZOMBIE,

  GRAVESTONE,

  CHEST_CLOSED,
  CHEST_OPEN,

  REWARD_BACK,
  REWARD_GOLD,
}

const gifs: Map<ImageType, any> = new Map();
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
  gif: any;
};

//FIXME: заменить gif-reader на
// https://stackoverflow.com/a/48323003
// https://github.com/rfrench/gify
// https://www.npmjs.com/package/jdataview
// или научиться парсить на сервере и возвращать распарсеную информацию
const loadGif = (type: ImageType): Promise<GifData> => {
  const gif = Gif();
  gif.load(getUrlByType(type));
  return new Promise<GifData>((resolve, _) => {
    gif.onload = (event: any) => {
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
    case ImageType.HERO:
      return HeroGifSrc;
    case ImageType.CRAB:
      return CrabGifSrc;
    case ImageType.PLANT:
      return PlantGifSrc;
    case ImageType.SLIME:
      return SlimeGifSrc;
    case ImageType.SPIDER:
      return SpiderGifSrc;
    case ImageType.ZOMBIE:
      return ZombieGifSrc;
    case ImageType.GRAVESTONE:
      return GravestoneImgSrc;
    case ImageType.CHEST_CLOSED:
      return ChestClosedImgSrc;
    case ImageType.CHEST_OPEN:
      return ChestOpenImgSrc;
    case ImageType.REWARD_BACK:
      return RewardBackImgSrc;
    case ImageType.REWARD_GOLD:
      return RewardGoldImgSrc;
    default:
      throw new Error(`Tyimg fetch url for unknown type ${ImageType[type]}`);
  }
};
