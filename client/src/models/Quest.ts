import { QuestResponse } from "../services/QuestsService";
import QuestCheckpoint from "./QuestCheckpoint";
import { convert as convertCheckpoint } from "./QuestCheckpoint";

export class Progress {
  constructor(
    public id: number,
    public duration: number,
    public embarkedTime: number,
    public checkpoints: QuestCheckpoint[]
  ) {}
}

export default class Quest {
  constructor(
    public id: number,
    public level: number,
    public title: string,
    public description: string,
    public experience: number,
    public duration: number,
    public tribute: number,
    public fame: number,
    public progress: Progress | null
  ) {}
}

const convert = (response: QuestResponse): Quest => {
  return new Quest(
    response.id,
    response.level,
    response.title,
    response.description,
    response.experience,
    response.duration,
    response.tribute,
    response.fame,
    response.progress_id
      ? new Progress(
          response.progress_id,
          response.progress_duration,
          Date.parse(response.embarked_time),
          (response.checkpoints as any[]).map((c) => convertCheckpoint(c))
        )
      : null
  );
};

export { convert };
