import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { onCompleteQuest } from "../../actions/ApiActions";
import AuthContext, { AuthProps } from "../../contexts/auth-context";
import withApiService, {
  WithApiServiceProps,
} from "../../hoc/with-api-service";
import Hero from "../../models/Hero";
import Quest from "../../models/Quest";
import { CheckpointType } from "../../models/QuestCheckpoint";
import { GUILD_SHARE } from "../../utils/variables";
import HeroItem from "../guild-display/heroes/hero-item";
import "./quest-reward.scss";

type QuestRewardProps = {
  auth: AuthProps;
  quest: Quest;
  heroes: Hero[];
  onCompleteQuest: (auth: AuthProps, quest: Quest, heroes: Hero[]) => void;
};

/**
 * TODO: реплика героев после выполнения квеста (в качестве небольшого суммари по квесту)
 * TODO: сделать отдельный экранчик для героев, hero-item получается кривым
 */

const QuestReward = ({
  auth,
  quest,
  heroes,
  onCompleteQuest,
}: QuestRewardProps) => {
  const clickHandler = () => {
    onCompleteQuest(auth, quest, heroes);
  };

  const checkpointsTribute = quest
    .progress!.checkpoints.filter((c) => c.type === CheckpointType.TREASURE)
    .map((c) => c.outcome.get(0)![0].value)
    .reduce((a, b) => a + b, 0);

  const heroGoldReward = Math.floor(
    Math.floor(quest.tribute * (1 - GUILD_SHARE)) / heroes.length +
      Math.floor(checkpointsTribute / heroes.length)
  );

  const heroExperienceReward = Math.floor(quest.experience / heroes.length);

  return (
    <div className="quest-reward" onClick={clickHandler}>
      <div className="quest-reward__content">
        <div className="quest-reward__title">{quest.title}</div>
        <div className="quest-reward__tribute">
          {Math.floor(quest.tribute * GUILD_SHARE)}
        </div>
        <div className="quest-reward__fame">{quest.fame}</div>
        <div className="quest-reward__heroes-holder">
          {heroes.map((hero) => (
            <div key={hero.id}>
              <HeroItem
                hero={hero}
                enabled={true}
                reward={{
                  gold: heroGoldReward,
                  experience: heroExperienceReward,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

type QuestRewardContainerProps = {
  quest: Quest;
  heroes: Hero[];
  onCompleteQuest: (auth: AuthProps, quest: Quest, heroes: Hero[]) => void;
};

class QuestRewardContainer extends Component<QuestRewardContainerProps, {}> {
  static contextType = AuthContext;
  render() {
    const auth = this.context;
    const { quest, heroes, onCompleteQuest } = this.props;

    if (!quest) {
      return null;
    }

    const questHeroes = heroes.filter((h) => h.embarkedQuest === quest.id);

    return (
      <QuestReward
        auth={auth}
        quest={quest}
        heroes={questHeroes}
        onCompleteQuest={onCompleteQuest}
      />
    );
  }
}

type state = {
  collectingQuestReward: Quest;
  heroes: Hero[];
};

const mapStateToProps = ({ collectingQuestReward, heroes }: state) => {
  return { quest: collectingQuestReward, heroes };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
  custonProps: WithApiServiceProps
) => {
  const { apiService } = custonProps;
  return bindActionCreators(
    {
      onCompleteQuest: onCompleteQuest(apiService),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(QuestRewardContainer);
