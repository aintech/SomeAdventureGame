import CheckpointActor from "../checkpoint-actor/CheckpointActor";
import { Direction, Effect, EventMessage } from "./EventMessage";
import Color, { stringify } from "./Color";
import { getGifs, getImages, ImageType } from "./ImageLoader";
import DrawData from "./DrawData";
import QuestCheckpoint, { CheckpointType } from "../../../../../models/QuestCheckpoint";

type Position = {
  x?: number;
  centerX?: boolean;
  y: number;
};

type Dimensions = Position & {
  width: number;
  height: number;
};

const drawDatas: Map<ImageType, DrawData> = new Map();

//TODO: Load only needed in current checkpoint images
export const prepareDrawDatas = async () => {
  return Promise.all([
    loadGifs().then((data) => data.forEach((v, k) => drawDatas.set(k, new DrawData(undefined, v)))),
    loadImages().then((data) => data.forEach((v, k) => drawDatas.set(k, new DrawData(v)))),
  ]).then((_) => (drawDatas.get(ImageType.REWARD_BACK)!.rotatePerFrame = 2));
};

export const drawActors = (actors: CheckpointActor[], canvasCtx: CanvasRenderingContext2D) => {
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
        width: defeated ? img.width * 0.07 : actor.isHero ? img.width * 0.25 : 112,
        height: defeated ? img.width * 0.07 : actor.isHero ? img.height * 0.25 : 120,
      },
      canvasCtx
    );
  });
};

const drawActor = (actor: CheckpointActor, img: any, dim: Dimensions, ctx: CanvasRenderingContext2D) => {
  ctx.drawImage(img, dim.x!, dim.y, dim.width, dim.height);

  if (actor.currentHealth > 0) {
    // const hpBarWidth = Math.floor((actor.currentHealth / actor.totalHealth) * 100);
    // ctx.fillStyle = "rgba(255, 0, 0, .7)";
    // ctx.fillRect(dim.x, dim.y, hpBarWidth, 10);

    drawText(ctx, `${actor.currentHealth}/${actor.totalHealth}`, dim, 18, "red");
  }
};

export const drawTreasure = (checkpoint: QuestCheckpoint, ctx: CanvasRenderingContext2D) => {
  let img = drawDatas.get(ImageType.CHEST_CLOSED)!;
  ctx.drawImage(img.image(), ctx.canvas.width * 0.5 - img.width() * 0.25, 270, img.width() * 0.5, img.height() * 0.5);
  drawText(ctx, "Cracking treasure chest...", { centerX: true, y: 200 }, 32, "lightgreen");
};

export const drawMessages = (msgs: EventMessage[], ctx: CanvasRenderingContext2D) => {
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

    let pos: Position;

    switch (msg.direction) {
      case Direction.CENTER:
        pos = { centerX: true, y: ctx.canvas.height * 0.5 + font * 0.5 };
        break;
      case Direction.RIGHT:
      case Direction.LEFT:
        const offset = timeOffset * 0.05;
        pos = { x: msg.position.x + offset * (msg.direction === Direction.LEFT ? -1 : 1), y: msg.position.y - offset };
        break;
      default:
        throw new Error(`Not implemented for ${Direction[msg.direction]}`);
    }

    drawText(ctx, msg.message, pos, font, color, `rgba(0, 0, 0, ${color.a})`);
  });
};

export const drawCompleted = (checkpoint: QuestCheckpoint, ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = `rgba(0, 0, 0, .4)`;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  let img = drawDatas.get(ImageType.REWARD_BACK)!;
  ctx.drawImage(
    img.image(),
    ctx.canvas.width * 0.5 - img.width() * 0.25,
    -img.height() * 0.25,
    img.width() * 0.5,
    img.height() * 0.5
  );

  img = drawDatas.get(ImageType.REWARD_GOLD)!;
  ctx.drawImage(img.image(), 150, 200, img.width() * 0.75, img.height() * 0.75);

  drawText(ctx, checkpoint.tribute.toString(), { x: 250, y: 275 }, 72);

  if (checkpoint.type === CheckpointType.BATTLE) {
    drawText(ctx, `Exp: ${checkpoint.enemies!.reduce((a, b) => a + b.experience, 0)}`, { x: 150, y: 175 }, 72);
  }
};

const drawText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  pos: Position,
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

const loadGifs = async () => {
  return await getGifs([
    ImageType.HERO,
    ImageType.CRAB,
    ImageType.PLANT,
    ImageType.SLIME,
    ImageType.SPIDER,
    ImageType.ZOMBIE,
  ]);
};

const loadImages = async () => {
  return await getImages([
    ImageType.GRAVESTONE,
    ImageType.CHEST_CLOSED,
    ImageType.CHEST_OPEN,
    ImageType.REWARD_BACK,
    ImageType.REWARD_GOLD,
  ]);
};
