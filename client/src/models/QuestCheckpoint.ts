enum CheckpointType {
  TREASURE,
  BATTLE,
}

enum CheckpointActionType {
  HERO_ATTACK_OPPONENT,
  OPPONENT_ATTACK_HERO,
}

class CheckpointActor {
  constructor(public id: number, public name: string) {}
}

class CheckpointAction {
  constructor(
    public actorId: number | null,
    public opponentId: number | null,
    public type: CheckpointActionType | null,
    public value: number
  ) {}
}

export default class QuestCheckpoint {
  constructor(
    public id: number,
    /** moment (second) on which checkpoint occures from quest start */
    public occuredTime: number,
    public type: CheckpointType,
    /** duration of checkpoint in seconds */
    public duration: number,
    /** key of this Map is second on which action occures */
    public outcome: Map<number, CheckpointAction[]>,
    public actors: CheckpointActor[]
  ) {}
}

const convertType = (type: string): CheckpointType => {
  switch (type) {
    case "treasure":
      return CheckpointType.TREASURE;
    case "battle":
      return CheckpointType.BATTLE;
    default:
      throw new Error(`Unknown checkpoint type ${type}`);
  }
};

const convertActionType = (action: string): CheckpointActionType => {
  switch (action) {
    case "hero_attack_opponent":
      return CheckpointActionType.HERO_ATTACK_OPPONENT;
    case "opponent_attack_hero":
      return CheckpointActionType.OPPONENT_ATTACK_HERO;
    default:
      throw new Error(`Unknown action type in converter ${action}`);
  }
};

const convertOutcome = (
  type: CheckpointType,
  outcome: string
): Map<number, CheckpointAction[]> => {
  const out: Map<number, CheckpointAction[]> = new Map();
  switch (type) {
    case CheckpointType.TREASURE:
      out.set(0, [
        new CheckpointAction(null, null, null, Number.parseInt(outcome)),
      ]);
      break;
    case CheckpointType.BATTLE:
      const parsed: Map<number, any[]> = new Map(JSON.parse(outcome)) as Map<
        number,
        any[]
      >;
      parsed.forEach((value, key) => {
        out.set(
          key,
          value.map(
            (v) =>
              new CheckpointAction(
                v.actorId,
                v.opponentId,
                convertActionType(v.action),
                v.value
              )
          )
        );
      });
      break;
    default:
      throw new Error(`Unknown checkpoint type in converter ${type}`);
  }
  return out;
};

const convertActors = (actors: any[]): CheckpointActor[] => {
  const acts: CheckpointActor[] = [];
  for (const actor of actors) {
    acts.push(new CheckpointActor(actor.id, actor.name));
  }
  return acts;
};

const convert = (checkpointApiResponse: any): QuestCheckpoint => {
  return new QuestCheckpoint(
    checkpointApiResponse.id,
    checkpointApiResponse.occured_time,
    convertType(checkpointApiResponse.type),
    checkpointApiResponse.duration,
    convertOutcome(
      convertType(checkpointApiResponse.type),
      checkpointApiResponse.outcome
    ),
    convertActors(checkpointApiResponse.actors)
  );
};

export { CheckpointType, convert };
