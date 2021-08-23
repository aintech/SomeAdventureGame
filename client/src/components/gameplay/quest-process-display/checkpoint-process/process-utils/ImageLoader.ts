import { Dispatch, SetStateAction } from "react";
import { Gif } from "../../../../../utils/gif-reader";

const gifs: Map<string, any> = new Map();
export const getGifs = async (src: string[]) => {
  const absentGifs = src.filter((s) => !gifs.has(s));
  const loaders = absentGifs.map((s) => loadGif(s));
  loaders.forEach((l) => l.then((d) => gifs.set(d.src, d.gif)));
  await Promise.all([...loaders]);
  return gifs;
};

//FIXME: заменить gif-reader на
// https://stackoverflow.com/a/48323003
// https://github.com/rfrench/gify
// https://www.npmjs.com/package/jdataview
const loadGif = (src: string): Promise<{ src: string; gif: any }> => {
  const gif = Gif();
  gif.load(src);
  return new Promise<any>((resolve, _) => {
    gif.onload = (event: any) => {
      if (src.includes("hero")) {
        console.log(`called onload ${src}`);
      }
      resolve({ src, gif: event.path[0] });
    };
  });
};

export const loadImage = (
  name: string,
  src: string,
  prevState: Map<string, HTMLImageElement>,
  setter: Dispatch<SetStateAction<Map<string, HTMLImageElement>>>
) => {
  const image = new Image();
  image.src = src;
  image.addEventListener(
    "load",
    (ev) => {
      const images = new Map(prevState);
      images.set(name, ev.currentTarget as HTMLImageElement);
      setter(images);
    },
    false
  );
};
