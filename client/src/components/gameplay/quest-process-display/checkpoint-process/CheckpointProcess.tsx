import { Component, createRef } from "react";
import Hero from "../../../../models/hero/Hero";
import QuestCheckpoint, { BattleActionType, BattleRound } from "../../../../models/QuestCheckpoint";
import Loader from "../../../loader/Loader";
import CheckpointActor, { convertToActor } from "./checkpoint-actor/CheckpointActor";
import "./checkpoint-process.scss";
import Color, { create } from "./process-utils/Color";
import { drawActors, drawMessages, loadGifs } from "./process-utils/DrawManager";

export enum Direction {
  LEFT,
  RIGHT,
  CENTER,
}

export enum Effect {
  FADE_IN,
  FADE_OUT,
  FADE_IN_OUT,
  FLY_AWAY,
}

export class EventMessage {
  private _id: number;
  private _fireTime: Date;

  constructor(
    public lifetime: number, // in seconds
    public position: { x: number; y: number },
    public fontSize: number,
    public message: string,
    public color: Color,
    public direction: Direction,
    public effect: Effect
  ) {
    this._id = new Date().getTime() * Math.random();
    this._fireTime = new Date();
  }

  public id() {
    return this._id;
  }

  public fireTime() {
    return this._fireTime;
  }
}

type CheckpointProcessProps = {
  checkpoint: QuestCheckpoint;
  heroes: Hero[];
  closeCheckpoint: () => void;
  checkpointPassed: () => void;
};

type CheckpointProcessState = {
  seconds: number;
  gifs: Map<string, any>;
  images: Map<string, HTMLImageElement>;
  eventMessages: EventMessage[];
  actors: CheckpointActor[];
  inBattle: boolean;
  loaded: boolean;
  beginTime?: Date;
};

class CheckpointProcess extends Component<CheckpointProcessProps, CheckpointProcessState> {
  private secondsTimer?: NodeJS.Timeout;
  private updateTimer?: NodeJS.Timeout;
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private canvas?: HTMLCanvasElement;
  private canvasCtx?: CanvasRenderingContext2D;

  constructor(props: CheckpointProcessProps) {
    super(props);
    this.state = {
      seconds: 0,
      gifs: new Map(),
      images: new Map(),
      eventMessages: [],
      actors: [],
      inBattle: false,
      loaded: false,
    };
    this.canvasRef = createRef();
    this.startTimers = this.startTimers.bind(this);
    this.updateSecond = this.updateSecond.bind(this);
    this.updateFrame = this.updateFrame.bind(this);
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current!;
    this.canvasCtx = this.canvas.getContext("2d")!;

    loadGifs().then((data) =>
      this.setState({
        gifs: data,
        loaded: true,
        beginTime: new Date(),
        eventMessages: [
          new EventMessage(2, { x: 0, y: 0 }, 72, "BEGIN", create(255, 255), Direction.CENTER, Effect.FADE_IN_OUT),
        ],
      })
    );

    const { checkpoint, heroes } = this.props;

    this.setState({
      actors: [
        ...heroes.map((h, idx) => convertToActor(h, idx, this.canvas!.height)),
        ...(checkpoint.enemies ? checkpoint.enemies.map((e, idx) => convertToActor(e, idx, this.canvas!.height)) : []),
      ].sort((a, b) => b.index - a.index),
    });

    this.startTimers();
  }

  componentWillUnmount() {
    if (this.secondsTimer) {
      clearInterval(this.secondsTimer);
    }
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
  }

  startTimers() {
    if (!this.secondsTimer) {
      this.secondsTimer = setInterval(this.updateSecond, 1000);
    }
    if (!this.updateTimer) {
      this.updateTimer = setInterval(this.updateFrame, 1000 / 40);
    }
  }

  updateSecond() {
    let seconds = this.state.seconds;
    let inBattle = this.state.inBattle;
    let beginTime = this.state.beginTime;

    if (this.state.loaded && beginTime) {
      seconds = Math.floor((new Date().getTime() - this.state.beginTime!.getTime()) * 0.001);
      this.setState({ seconds });
    }
    if (!this.state.inBattle && this.state.seconds >= 2) {
      inBattle = true;
      seconds = 0;
      beginTime = new Date();
      this.setState({ inBattle, beginTime, seconds, eventMessages: [] });
    }
    if (inBattle) {
      const round = this.props.checkpoint.rounds!.get(seconds);
      if (round) {
        this.processRound(round);
      }
    }
  }

  updateFrame() {
    if (this.state.loaded && this.canvasCtx) {
      this.draw();
    }
    this.checkEndedMessages();
  }

  draw() {
    this.canvasCtx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    drawActors(this.state.actors, this.state.gifs, this.canvasCtx!);
    drawMessages(this.state.eventMessages, this.canvasCtx!);
  }

  processRound(round: BattleRound[]) {
    let events: { isHeroAttack: boolean; victimId: number; position: { x: number; y: number }; amount: number }[] = [];

    round.forEach((r) => {
      switch (r.action) {
        case BattleActionType.HERO_ATTACK:
        case BattleActionType.ENEMY_ATTACK:
          const isHeroAttack = r.action === BattleActionType.HERO_ATTACK;
          const victim = this.state.actors.find(
            (a) => a.isHero !== isHeroAttack && a.actorId === (isHeroAttack ? r.enemyId : r.heroId)
          )!;
          victim.currentHealth -= r.damage!;
          const existsIdx = events.findIndex((e) => e.isHeroAttack === isHeroAttack && e.victimId === victim.actorId);
          if (existsIdx === -1) {
            events.push({ isHeroAttack, victimId: victim.actorId, position: victim.position, amount: r.damage! });
          } else {
            const existsMsg = events[existsIdx];
            const updatedMsg = {
              isHeroAttack,
              victimId: victim.actorId,
              position: victim.position,
              amount: r.damage! + existsMsg.amount,
            };
            events = [...events.slice(0, existsIdx), updatedMsg, ...events.slice(existsIdx + 1)];
          }
          break;
        default:
          throw new Error(`Unknown battle action type ${BattleActionType[r.action]}`);
      }
    });

    const messages = events.map(
      (e) =>
        new EventMessage(
          2,
          e.position,
          32,
          `-${e.amount} HP`,
          create(255),
          e.isHeroAttack ? Direction.RIGHT : Direction.LEFT,
          Effect.FLY_AWAY
        )
    );

    this.setState((state) => {
      return { eventMessages: [...state.eventMessages, ...messages] };
    });
  }

  checkEndedMessages() {
    const endedMessages = this.state.eventMessages.filter(
      (m) => m.fireTime().getTime() + m.lifetime * 1000 < new Date().getTime()
    );

    if (endedMessages.length > 0) {
      const filteredMessages = this.state.eventMessages;
      for (let i = 0; i < endedMessages.length; i++) {
        const idx = filteredMessages.findIndex((m) => m.id() === endedMessages[i].id());
        filteredMessages.splice(idx, 1);
      }
      this.setState({ eventMessages: filteredMessages });
    }
  }

  render() {
    return (
      <div className="checkpoint-process__container">
        {!this.state.loaded ? <Loader message="Loading scene" /> : null}
        <canvas width={750} height={400} ref={this.canvasRef}></canvas>
      </div>
    );
  }
}

export default CheckpointProcess;

// const CheckpointProcessOld = ({ checkpoint, heroes, checkpointPassed, closeCheckpoint }: CheckpointProcessProps) => {
//   // const [images, setImages] = useState<Map<string, HTMLImageElement>>(new Map());
//   const [seconds, setSeconds] = useState<number>(0);
//   const [gifs, setGifs] = useState<Map<string, any>>(new Map());
//   // const [eventMessages, setEventMessages] = useState<EventMessage[]>([]);
//   const [actors, setActors] = useState<CheckpointActor[]>([]);
//   const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D>();
//   const [inBattle, setInBattle] = useState<boolean>(false);
//   const [loaded, setLoaded] = useState<boolean>(false);
//   const [beginTime, setBeginTime] = useState<Date>();
//   // const [drawCalls, setDrawCalls] = useState(0);

//   const canvas = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);

//   const eventMessages: EventMessage[] = [];

//   useEffect(() => {
//     console.log("gifs");
//     loadGifs().then((g) => {
//       setGifs(g);
//       if (gifs.size > 0) {
//         setLoaded(true);
//       }
//     });
//   }, [gifs]);

//   useEffect(() => {
//     console.log("actors");
//     const acts = heroes.map((h) => convertToActor(h));
//     if (checkpoint.enemies) {
//       checkpoint.enemies.forEach((e) => acts.push(convertToActor(e)));
//     }
//     setActors(acts);
//   }, [heroes, checkpoint.enemies]);

//   useEffect(() => {
//     console.log("canvas");
//     if (canvas.current.getContext("2d")) {
//       setCanvasCtx(canvas.current.getContext("2d")!);
//       canvas.current.getContext("2d")!.clearRect(0, 0, canvas.current.width, canvas.current.height);
//     }
//   }, [canvas]);

//   useEffect(() => {
//     console.log("timers");
//     let updateTimer: any;
//     let secTimer: any;

//     if (loaded) {
//       console.log("timers 2");
//       updateTimer = setInterval(() => update(), 1000 / 40);
//       secTimer = setInterval(() => updateSec(), 1000);

//       eventMessages.push({
//         fireTime: new Date(),
//         fontSize: 72,
//         message: "BEGIN",
//         color: color(255, 255),
//         direction: Direction.CENTER,
//         effect: Effect.FADE_IN_OUT,
//       });

//       setBeginTime(new Date());
//     }

//     return () => {
//       clearInterval(updateTimer);
//       clearInterval(secTimer);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [loaded]);

//   if (!checkpoint) {
//     return null;
//   }

//   const update = () => {
//     if (loaded) {
//       if (canvasCtx) {
//         canvasCtx.clearRect(0, 0, canvas.current.width, canvas.current.height);
//         drawActors(actors, gifs, canvasCtx);
//         drawMessages(eventMessages, canvasCtx);
//         if (!inBattle) {
//           if (seconds >= 3) {
//             setInBattle(true);
//             //       // setSeconds(0);
//             eventMessages.length = 0;
//           }
//         }
//       }
//     }
//   };

//   const updateSec = () => {
//     if (loaded && beginTime) {
//       setSeconds(Math.floor(new Date().getTime() - beginTime.getTime()) * 0.001);
//       console.log(seconds, Math.floor((new Date().getTime() - beginTime.getTime()) * 0.001));
//     }
//   };

//   // <div className="checkpoint-process__heroes"></div>
//   // <div className="checkpoint-process__loot"></div>
//   // <div className="checkpoint-process__enemies"></div>

//   return (
//     <div className="checkpoint-process__container">
//       {!loaded ? <Loader message="Loading scene" /> : null}
//       <canvas width={750} height={400} ref={canvas}></canvas>
//     </div>
//   );
// };
