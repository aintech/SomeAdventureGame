import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { onCompleteQuest } from "../../../actions/ApiActions";
import AuthContext, { AuthProps } from "../../../contexts/AuthContext";
import withApiService, {
  WithApiServiceProps,
} from "../../../hoc/WithApiService";
import Hero from "../../../models/Hero";
import Quest from "../../../models/Quest";
import { CheckpointType } from "../../../models/QuestCheckpoint";
import { GUILD_SHARE } from "../../../utils/variables";
import HeroItem from "../guild-display/heroes/HeroItem";
import "./quest-reward.scss";
import fameImg from "../../../img/quest-reward/quest-reward_star.png";
import goldImg from "../../../img/quest-reward/quest-reward_gold.png";

type QuestRewardProps = {
  auth: AuthProps;
  quest: Quest;
  heroes: Hero[];
  onCompleteQuest: (auth: AuthProps, quest: Quest, heroes: Hero[]) => void;
};

/**
 * TODO: реплика героев после выполнения квеста (в качестве небольшого суммари по квесту)
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
      <div className="quest-reward__container">
        <div className="quest-reward__scroll">
          <div className="quest-reward__title">{quest.title}</div>
          <div className="quest-reward__tribute">
            <img src={goldImg} alt="gold" />
            <span className="quest-reward__tribute--text">
              {Math.floor(quest.tribute * GUILD_SHARE)} g
            </span>
          </div>
          <div className="quest-reward__fame">
            <img src={fameImg} alt="fame" />
            <span className="quest-reward__fame--text">{quest.fame} f</span>
          </div>
        </div>
        <div className="quest-reward__heroes-holder">
          {heroes.map((hero) => (
            <HeroItem
              key={hero.id}
              hero={hero}
              enabled={true}
              reward={{
                gold: heroGoldReward,
                experience: heroExperienceReward,
              }}
            />
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

type QuestRewardState = {
  collectingQuestReward: Quest;
  heroes: Hero[];
};

const mapStateToProps = ({
  collectingQuestReward,
  heroes,
}: QuestRewardState) => {
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
