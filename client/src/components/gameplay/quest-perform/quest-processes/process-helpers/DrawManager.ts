import QuestCheckpoint from '../../../../../models/QuestCheckpoint';
import Gif from '../../../../../utils/Gif';
import { CenteredPosition, Position } from '../../../../../utils/Utils';
import CheckpointActor from './CheckpointActor';
import Color, { stringify } from './Color';
import DrawData from './DrawData';
import { Drop, DropType } from './Drop';
import { Direction, Effect, EventMessage } from './EventMessage';
import { getGifs, getImages, ImageType } from './ImageLoader';

let canvasCtx: CanvasRenderingContext2D;
let dynamicCanvasCtx: CanvasRenderingContext2D;

const drawDatas: Map<ImageType, DrawData> = new Map();

const hits: { idx: number; pos: Position; gif: Gif; frame: number }[] = [];

/**-------------------------- COMMON -------------------------------*/

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

export const clearCtx = () => {
  canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
};

export const clearDynamicCtx = () => {
  dynamicCanvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
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
          img = drawDatas.get(ImageType.DUST_DROP)!.image();
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
  ctx.fillStyle = color ? stringify(color) : 'white';
  // ctx.miterLimit = 2;
  ctx.fillText(text, x, pos.y);
  ctx.lineCap = 'round';
};

export const drawStaticText = (text: string, pos: CenteredPosition, fontSize?: number, color?: Color | string, stroke?: Color | string) => {
  drawText(canvasCtx, text, pos, fontSize, color, stroke);
};

export const getPixel = (point: Position) => {
  return dynamicCanvasCtx.getImageData(point.x, point.y, 1, 1);
};

/**-------------------------- BATTLE -------------------------------*/

const imageByActorType = (type: string, hitted: boolean) => {
  switch (type) {
    case 'snake':
      return hitted ? ImageType.SNAKE_HIT : ImageType.SNAKE;
    case 'goblin':
      return hitted ? ImageType.GOBLIN_HIT : ImageType.GOBLIN;
    case 'moth':
      return hitted ? ImageType.MOTH_HIT : ImageType.MOTH;
    default:
      throw new Error(`Unknown actor type ${type}`);
  }
};

export const addToHitsDrawQueue = (pos: Position) => {
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

export const drawOpponent = (actor: CheckpointActor) => {
  const hitted = actor.hitTime + 300 > new Date().getTime();
  const img = drawDatas.get(imageByActorType(actor.type, hitted))!;

  dynamicCanvasCtx.drawImage(
    img.image(),
    dynamicCanvasCtx.canvas.width * 0.5 - img.width() * 0.5 + actor.xOffset,
    (hitted ? img.height() * 0.01 : 0) - 12 + 58, // пока хардкодим разницу высоты полотна и картинки
    img.width(),
    hitted ? img.height() * 0.99 : img.height()
  );

  const hpBarWidth = Math.floor((actor.health / actor.totalHealth) * 100) * 5;
  dynamicCanvasCtx.fillStyle = 'rgba(255, 0, 0, .7)';
  dynamicCanvasCtx.fillRect(dynamicCanvasCtx.canvas.width * 0.5 - hpBarWidth * 0.5, 20, hpBarWidth, 20);

  if (actor.health > 0) {
    drawText(dynamicCanvasCtx, `${actor.health}/${actor.totalHealth}`, { centerX: true, x: 0, y: 38 }, 24);
  }
};

export const drawBattleCompleted = (checkpoint: QuestCheckpoint, won: boolean, drops: Drop[]) => {
  canvasCtx.fillStyle = `rgba(0, 0, 0, .4)`;
  canvasCtx.fillRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

  let img = drawDatas.get(ImageType.RESULT_BACK)!;
  canvasCtx.drawImage(
    img.image(),
    canvasCtx.canvas.width * 0.5 - img.width() * 0.25,
    -img.height() * 0.25,
    img.width() * 0.5,
    img.height() * 0.5
  );

  if (won) {
    img = drawDatas.get(ImageType.RESULT_GOLD)!;
    canvasCtx.drawImage(img.image(), 150, 300, img.width() * 0.75, img.height() * 0.75);

    drawText(canvasCtx, `Exp: ${checkpoint.enemies!.reduce((a, b) => a + b.experience, 0)}`, { x: 150, y: 275 }, 72);

    const collectedGold = drops.filter((d) => d.type === DropType.GOLD && d.collected).reduce((a, b) => a + b.amount, 0);
    drawText(canvasCtx, `${checkpoint.tribute}${collectedGold > 0 ? ' + ' + collectedGold : ''}`, { x: 250, y: 375 }, 72);
  }
};

/**-------------------------- TREASURE -------------------------------*/

export const drawTarget = (pos: Position, radius: number) => {
  canvasCtx.beginPath();
  canvasCtx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);
  canvasCtx.fillStyle = 'rgba(0, 255, 0, .3)';
  canvasCtx.fill();
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'white';
  canvasCtx.stroke();
};

export const drawTreasureChest = (opened: boolean, offset: Position & { rotation: number }) => {
  let img = drawDatas.get(opened ? ImageType.CHEST_OPENED : ImageType.CHEST_CLOSED)!;

  dynamicCanvasCtx.setTransform(
    1,
    0,
    0,
    1,
    dynamicCanvasCtx.canvas.width * 0.5 + offset.x,
    dynamicCanvasCtx.canvas.height + offset.y - 100
  );
  dynamicCanvasCtx.rotate((offset.rotation * Math.PI) / 180);
  dynamicCanvasCtx.drawImage(img.image(), -img.width() * 0.5, -img.height() * 0.5, img.width(), img.height());
  dynamicCanvasCtx.rotate((-offset.rotation * Math.PI) / 180);
  dynamicCanvasCtx.setTransform(1, 0, 0, 1, 0, 0);
};

export const drawTreasureCompleted = (gold?: number) => {
  canvasCtx.fillStyle = `rgba(0, 0, 0, .4)`;
  canvasCtx.fillRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

  let img = drawDatas.get(ImageType.RESULT_BACK)!;
  canvasCtx.drawImage(
    img.image(),
    canvasCtx.canvas.width * 0.5 - img.width() * 0.25,
    -img.height() * 0.25,
    img.width() * 0.5,
    img.height() * 0.5
  );

  if (gold) {
    img = drawDatas.get(ImageType.RESULT_GOLD)!;
    canvasCtx.drawImage(img.image(), 150, 300, img.width() * 0.75, img.height() * 0.75);
    drawText(canvasCtx, `${gold}`, { x: 250, y: 375 }, 72);
  }
};
