import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { onCompleteQuest } from "../../actions/actions";
import AuthContext from "../../contexts/auth-context";
import withApiService from "../../hoc/with-api-service";
import { GUILD_SHARE } from "../../utils/variables";
import HeroItem from "../guild-display/heroes/hero-item";
import "./quest-reward.scss";

/**
 * TODO: реплика героев после выполнения квеста (в качестве небольшого суммари по квесту)
 * TODO: сделать отдельный экранчик для героев, hero-item получается кривым
 */

const QuestReward = ({ auth, quest, heroes, onCompleteQuest }) => {
  const clickHandler = () => {
    onCompleteQuest(auth, quest, heroes);
  };

  const checkpointsTribute = quest.checkpoints
    .filter((c) => c.type === "treasure")
    .map((c) => +c.outcome)
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

class QuestRewardContainer extends Component {
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

const mapStateToProps = ({ collectingQuestReward, heroes }) => {
  return { quest: collectingQuestReward, heroes };
};

const mapDispatchToProps = (dispatch, custonProps) => {
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
