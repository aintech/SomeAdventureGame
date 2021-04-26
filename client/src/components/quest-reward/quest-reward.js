import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { onQuestRewardCollected } from "../../actions/actions";
import withApiService from "../../hoc/with-api-service";
import HeroItem from "../guild-display/heros/hero-item";
import "./quest-reward.scss";

const QuestReward = ({ quest, heroes, onQuestRewardCollected }) => {
  const clickHandler = () => {
    onQuestRewardCollected({ quest, heroes });
  };

  const heroGoldReward = Math.floor(
    Math.floor(quest.tribute * 0.5) / heroes.length
  );

  const heroExperienceReward = Math.floor(quest.experience / heroes.length);

  return (
    <div className="quest-reward" onClick={clickHandler}>
      <div className="quest-reward__content">
        <div className="quest-reward__title">{quest.title}</div>
        <div className="quest-reward__tribute">
          {Math.floor(quest.tribute * 0.5)}
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

class QuestRewardContainer extends Component {
  render() {
    const { quest, embarkedQuests, onQuestRewardCollected } = this.props;

    if (!quest) {
      return null;
    }

    const heroes = embarkedQuests.filter(
      (embark) => embark.key.id === quest.id
    )[0].value;

    if (!heroes) {
      return null;
    }

    return (
      <QuestReward
        quest={quest}
        heroes={heroes}
        onQuestRewardCollected={onQuestRewardCollected}
      />
    );
  }
}

const mapStateToProps = ({ collectingQuestReward, embarkedQuests }) => {
  return { quest: collectingQuestReward, embarkedQuests };
};

const mapDispatchToProps = (dispatch, custonProps) => {
  const { apiService } = custonProps;
  return bindActionCreators(
    {
      onQuestRewardCollected: onQuestRewardCollected(apiService),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(QuestRewardContainer);
