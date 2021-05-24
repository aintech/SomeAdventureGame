import QuestCheckpoint from "./QuestCheckpoint";
import { convert as convertCheckpoint } from "./QuestCheckpoint";

class Progress {
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

const convert = (questApiResponse: any): Quest => {
  return new Quest(
    +questApiResponse.id,
    +questApiResponse.level,
    questApiResponse.title,
    questApiResponse.description,
    +questApiResponse.experience,
    +questApiResponse.duration,
    +questApiResponse.tribute,
    +questApiResponse.fame,
    questApiResponse.progress_id
      ? new Progress(
          +questApiResponse.progress_id,
          +questApiResponse.process_duration,
          Date.parse(questApiResponse.embarked_time),
          (questApiResponse.checkpoints as any[]).map((c) =>
            convertCheckpoint(c)
          )
        )
      : null
  );
};

export { Progress, convert };
