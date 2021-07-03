import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { onCompleteQuest } from "../../../actions/ApiActions";
import withApiService, {
  WithApiServiceProps,
} from "../../../hoc/WithApiService";
import goldImg from "../../../img/quest-reward/quest-reward_gold.png";
import fameImg from "../../../img/quest-reward/quest-reward_star.png";
import Hero from "../../../models/hero/Hero";
import Quest from "../../../models/Quest";
import { GUILD_SHARE } from "../../../utils/variables";
import HeroItem from "../guild-display/heroes/HeroItem";
import "./quest-reward.scss";

type QuestRewardProps = {
  quest: Quest;
  heroes: Hero[];
  onCompleteQuest: (quest: Quest, heroes: Hero[]) => void;
};

/**
 * TODO: реплика героев после выполнения квеста (в качестве небольшого суммари по квесту)
 */

const QuestReward = ({ quest, heroes, onCompleteQuest }: QuestRewardProps) => {
  const clickHandler = () => {
    onCompleteQuest(quest, heroes);
  };

  const checkpointsTribute = quest
    .progress!.checkpoints.map((c) => c.tribute)
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
  onCompleteQuest: (quest: Quest, heroes: Hero[]) => void;
};

class QuestRewardContainer extends Component<QuestRewardContainerProps, {}> {
  render() {
    const { quest, heroes, onCompleteQuest } = this.props;

    if (!quest) {
      return null;
    }

    const questHeroes = heroes.filter(
      (h) => h.activity?.activityId === quest.id
    );

    return (
      <QuestReward
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
  const { apiService, auth } = custonProps;
  return bindActionCreators(
    {
      onCompleteQuest: onCompleteQuest(apiService, auth),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(QuestRewardContainer);
