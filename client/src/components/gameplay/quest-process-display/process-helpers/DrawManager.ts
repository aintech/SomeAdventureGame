import QuestCheckpoint, { CheckpointType } from "../../../../models/QuestCheckpoint";
import Gif from "../../../../utils/Gif";
import { CenteredPosition, Dimensions, Position } from "../../../../utils/Utils";
import CheckpointActor from "./CheckpointActor";
import Color, { stringify } from "./Color";
import DrawData from "./DrawData";
import { Drop, DropType } from "./Drop";
import { Direction, Effect, EventMessage } from "./EventMessage";
import { getGifs, getImages, ImageType } from "./ImageLoader";

let canvasCtx: CanvasRenderingContext2D;
let dynamicCanvasCtx: CanvasRenderingContext2D;

const drawDatas: Map<ImageType, DrawData> = new Map();

const hits: { idx: number; pos: Position; gif: Gif; frame: number }[] = [];

export const prepare = async (
  ctx: CanvasRenderingContext2D,
  dynamicCtx: CanvasRenderingContext2D,
  images?: ImageType[],
  gifs?: ImageType[]
) => {
  canvasCtx = ctx;
  dynamicCanvasCtx = dynamicCtx;
  return Promise.all([
    loadGifs(gifs).then((data) => data.forEach((v, k) => drawDatas.set(k, new DrawData(undefined, v)))),
    loadImages(images).then((data) => data.forEach((v, k) => drawDatas.set(k, new DrawData(v)))),
  ]);
};

export const dropToHits = (pos: Position) => {
  hits.push({ idx: new Date().getTime(), pos, gif: drawDatas.get(ImageType.ATTACK)!.raw() as Gif, frame: 1 });
};

export const drawHits = () => {
  hits.forEach((s) => {
    if (s.frame >= s.gif.frameCount) {
      hits.splice(hits.findIndex((a) => a.idx === s.idx));
    } else {
      dynamicCanvasCtx.drawImage(s.gif.image, s.pos.x - 64, s.pos.y - 64);
      s.frame++;
    }
  });
};

export const clearCtx = () => {
  canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
};

export const clearDynamicCtx = () => {
  dynamicCanvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
};

export const drawOpponent = (actor: CheckpointActor) => {
  const img = drawDatas.get(ImageType.SNAKE)!;

  canvasCtx.drawImage(img.image(), canvasCtx.canvas.width * 0.5 - img.width() * 0.5, 0, img.width(), img.height());

  const hpBarWidth = Math.floor((actor.currentHealth / actor.totalHealth) * 100) * 5;
  canvasCtx.fillStyle = "rgba(255, 0, 0, .7)";
  canvasCtx.fillRect(canvasCtx.canvas.width * 0.5 - hpBarWidth * 0.5, 20, hpBarWidth, 20);

  if (actor.currentHealth > 0) {
    drawText(canvasCtx, `${actor.currentHealth}/${actor.totalHealth}`, { centerX: true, x: 0, y: 38 }, 24);
  }
};

export const drawActors = (actors: CheckpointActor[]) => {
  actors.forEach((actor) => {
    const defeated = actor.currentHealth <= 0;
    const imgType = defeated ? ImageType.GRAVESTONE : actor.isHero ? ImageType.HERO : imageByActorType(actor.type);
    const img = drawDatas.get(imgType)!.image();
    drawActor(
      actor,
      img,
      {
        x: actor.position.x,
        y: actor.position.y,
      },
      {
        width: defeated ? img.width * 0.07 : actor.isHero ? img.width * 0.25 : 112,
        height: defeated ? img.width * 0.07 : actor.isHero ? img.height * 0.25 : 120,
      }
    );
  });
};

const drawActor = (actor: CheckpointActor, img: any, pos: Position, dim: Dimensions) => {
  dynamicCanvasCtx.drawImage(img, pos.x, pos.y, dim.width, dim.height);

  if (actor.currentHealth > 0) {
    drawText(dynamicCanvasCtx, `${actor.currentHealth}/${actor.totalHealth}`, pos, 18, "red");
  }
};

export const drawTreasure = (checkpoint: QuestCheckpoint) => {
  let img = drawDatas.get(ImageType.CHEST_CLOSED)!;
  canvasCtx.drawImage(
    img.image(),
    canvasCtx.canvas.width * 0.5 - img.width() * 0.25,
    270,
    img.width() * 0.5,
    img.height() * 0.5
  );
  drawText(dynamicCanvasCtx, "Cracking treasure chest...", { centerX: true, x: 0, y: 200 }, 32, "lightgreen");
};

export const drawDrops = (drops: Drop[]) => {
  drops.forEach((drop) => {
    if (drop.lifeTill - 2000 < new Date().getTime()) {
      drop.blinkCtr++;
      if (drop.blinkCtr > 5) {
        drop.blinkCtr = 0;
      }
    }
    if (drop.blinkCtr <= 2) {
      let img;
      switch (drop.type) {
        case DropType.GOLD:
          img = drawDatas.get(ImageType.REWARD_GOLD)!.image();
          break;
        default:
          throw new Error(`Unknown drop type ${DropType[drop.type]}`);
      }
      dynamicCanvasCtx.drawImage(img, drop.position.x, drop.position.y, drop.dimensions.width, drop.dimensions.height);
    }
  });
};

export const drawMessages = (msgs: EventMessage[]) => {
  msgs.forEach((msg) => {
    let font = msg.fontSize;
    let color: Color = { ...msg.color };

    const timeOffset = new Date().getTime() - msg.fireTime().getTime();

    switch (msg.effect) {
      case undefined:
        //do nothing
        break;
      case Effect.FADE_IN_OUT:
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
      case Effect.FLY_AWAY:
        break;
      default:
        throw new Error(`Not implemented for ${Effect[msg.effect]}`);
    }

    let pos: CenteredPosition;

    switch (msg.direction) {
      case Direction.CENTER:
        pos = { centerX: true, x: 0, y: canvasCtx.canvas.height * 0.5 + font * 0.5 };
        break;
      case Direction.RIGHT:
      case Direction.LEFT:
        const offset = timeOffset * 0.1;
        pos = { x: msg.position.x + offset * (msg.direction === Direction.LEFT ? -1 : 1), y: msg.position.y - offset };
        break;
      default:
        throw new Error(`Not implemented for ${Direction[msg.direction]}`);
    }

    drawText(dynamicCanvasCtx, msg.message, pos, font, color, `rgba(0, 0, 0, ${color.a})`);
  });
};

export const drawCompleted = (checkpoint: QuestCheckpoint, drops: Drop[]) => {
  canvasCtx.fillStyle = `rgba(0, 0, 0, .4)`;
  canvasCtx.fillRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

  let img = drawDatas.get(ImageType.REWARD_BACK)!;
  canvasCtx.drawImage(
    img.image(),
    canvasCtx.canvas.width * 0.5 - img.width() * 0.25,
    -img.height() * 0.25,
    img.width() * 0.5,
    img.height() * 0.5
  );

  img = drawDatas.get(ImageType.REWARD_GOLD)!;
  canvasCtx.drawImage(img.image(), 150, 300, img.width() * 0.75, img.height() * 0.75);

  if (checkpoint.type === CheckpointType.BATTLE) {
    drawText(canvasCtx, `Exp: ${checkpoint.enemies!.reduce((a, b) => a + b.experience, 0)}`, { x: 150, y: 275 }, 72);
  }

  const collectedGold = drops.filter((d) => d.type === DropType.GOLD && d.collected).reduce((a, b) => a + b.amount, 0);
  drawText(canvasCtx, `${checkpoint.tribute}${collectedGold > 0 ? " + " + collectedGold : ""}`, { x: 250, y: 375 }, 72);
};

const drawText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  pos: CenteredPosition,
  fontSize?: number,
  color?: Color | string,
  stroke?: Color | string
) => {
  ctx.font = `${fontSize ?? 18}px Pattaya`;
  let x = pos.centerX ? ctx.canvas.width * 0.5 - ctx.measureText(text).width * 0.5 : pos.x ?? 0;

  ctx.strokeStyle = stroke ? stringify(stroke) : `black`;
  ctx.lineWidth = 2;
  ctx.strokeText(text, x, pos.y);
  ctx.fillStyle = color ? stringify(color) : "white";
  // ctx.miterLimit = 2;
  ctx.fillText(text, x, pos.y);
  ctx.lineCap = "round";
};

const imageByActorType = (type: string) => {
  switch (type) {
    case "crab":
      return ImageType.CRAB;
    case "plant":
      return ImageType.PLANT;
    case "slime":
      return ImageType.SLIME;
    case "spider":
      return ImageType.SPIDER;
    case "zombie":
      return ImageType.ZOMBIE;
    default:
      throw new Error(`Unknown actor type ${type}`);
  }
};

const loadGifs = async (types?: ImageType[]) => {
  if (!types) {
    return Promise.resolve(new Map());
  }
  return await getGifs(types);
};

const loadImages = async (types?: ImageType[]) => {
  if (!types) {
    return Promise.resolve(new Map());
  }
  return await getImages(types);
};
