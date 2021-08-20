import CrabGifSrc from "../../../../../img/quest-process-display/actors/crab.gif";
import HeroGifSrc from "../../../../../img/quest-process-display/actors/hero.gif";
import PlantGifSrc from "../../../../../img/quest-process-display/actors/plant.gif";
import SlimeGifSrc from "../../../../../img/quest-process-display/actors/slime.gif";
import SpiderGifSrc from "../../../../../img/quest-process-display/actors/spider.gif";
import ZombieGifSrc from "../../../../../img/quest-process-display/actors/zombie.gif";
import CheckpointActor from "../checkpoint-actor/CheckpointActor";
import { Direction, Effect, EventMessage } from "../CheckpointProcess";
import { getGifs } from "./ImageLoader";

export const drawActors = (actors: CheckpointActor[], gifs: Map<string, any>, canvasCtx: CanvasRenderingContext2D) => {
  const heroes = actors.filter((a) => a.isHero);
  const enemies = actors.filter((a) => !a.isHero);

  for (let i = heroes.length - 1; i >= 0; i--) {
    const gif = gifs.get(HeroGifSrc);
    canvasCtx.drawImage(
      gif.image,
      30 + 50 * i,
      canvasCtx.canvas.height - 135 - 15 * i,
      gif.width * 0.25,
      gif.height * 0.25
    );
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    canvasCtx.drawImage(
      gifs.get(srcByEnemyType(enemies[i].type)).image,
      600 - 50 * i,
      canvasCtx.canvas.height - 120 - 15 * i,
      112,
      120
    );
  }
};

export const drawMessages = (msgs: EventMessage[], ctx: CanvasRenderingContext2D) => {
  msgs.forEach((msg) => {
    let font = msg.fontSize;
    let color = { ...msg.color };

    switch (msg.effect) {
      case undefined:
        //do nothing
        break;
      case Effect.FADE_IN_OUT:
        const timeOffset = new Date().getTime() - msg.fireTime.getTime();
        if (timeOffset <= 500) {
          color.a = Math.min(1, timeOffset * 0.001);
        } else if (timeOffset > 500 && timeOffset < 1000) {
          color.a = 1;
        } else if (timeOffset >= 1000 && timeOffset <= 2000) {
          color.a = Math.max(0, (2000 - timeOffset) * 0.001);
          font += Math.floor(timeOffset - 1000);
        } else {
          color.a = 0;
        }
        break;
      default:
        throw new Error(`Not implemented for ${Effect[msg.effect]}`);
    }

    ctx.font = `${font}px Pattaya`;
    let pos: { x: number; y: number };

    switch (msg.direction) {
      case Direction.CENTER:
        const textDim = ctx.measureText(msg.message);
        pos = { x: ctx.canvas.width * 0.5 - textDim.width * 0.5, y: ctx.canvas.height * 0.5 + font * 0.5 };
        break;
      default:
        throw new Error(`Not implemented for ${Direction[msg.direction]}`);
    }

    ctx.strokeStyle = `rgba(0, 0, 0, ${color.a})`;
    ctx.lineWidth = 2;
    ctx.strokeText(msg.message, pos.x, pos.y);
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    // ctx.miterLimit = 2;
    ctx.fillText(msg.message, pos.x, pos.y);
    ctx.lineCap = "round";
  });
};

const srcByEnemyType = (type: string) => {
  switch (type) {
    case "crab":
      return CrabGifSrc;
    case "plant":
      return PlantGifSrc;
    case "slime":
      return SlimeGifSrc;
    case "spider":
      return SpiderGifSrc;
    case "zombie":
      return ZombieGifSrc;
    default:
      throw new Error(`Unknown enemy type ${type}`);
  }
};

export const loadGifs = async () => {
  return await getGifs([HeroGifSrc, CrabGifSrc, PlantGifSrc, SlimeGifSrc, SpiderGifSrc, ZombieGifSrc]);
};
