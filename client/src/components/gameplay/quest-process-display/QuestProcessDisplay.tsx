import React, { Component, MouseEvent } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { closeQuestProcess, heroStatsChoosed } from "../../../actions/Actions";
import { onCheckpointPassed } from "../../../actions/ApiActions";
import withApiService, { WithApiServiceProps } from "../../../hoc/WithApiService";
import Hero from "../../../models/hero/Hero";
import Quest from "../../../models/Quest";
import QuestCheckpoint, { CheckpointType } from "../../../models/QuestCheckpoint";
import Loader from "../../loader/Loader";
import HeroItem from "../village-building-display/guild-display/heroes/hero-item/HeroItem";
import BattleProcess from "./battle-process/BattleProcess";
import CheckpointProcess from "./checkpoint-process/CheckpointProcess";
import QuestComplete from "./quest-complete/QuestComplete";
import QuestMap from "./quest-map/QuestMap";
import "./quest-process-display.scss";

export type QuestProcess = {
  quest: Quest;
  heroes: Hero[];
};

type QuestProcessDisplayProps = {
  quest: Quest;
  heroes: Hero[];
  heroClicked: (hero: Hero) => void;
  onCheckpointPassed: (quest: Quest, checkpoint: QuestCheckpoint) => void;
  closeDisplay: () => void;
};

const QuestProcessDisplay = ({
  quest,
  heroes,
  heroClicked,
  onCheckpointPassed,
  closeDisplay,
}: QuestProcessDisplayProps) => {
  const [activeCheckpoint, setActiveCheckpoint] = useState<QuestCheckpoint>();
  const [heroRewards, setHeroRewards] = useState<Map<number, { gold: number; experience: number }>>(new Map());

  const heroClickHandler = (hero: Hero, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    heroClicked(hero);
  };

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).id === "quest-process-display") {
      closeDisplay();
    }
  };

  const checkpointActivated = (checkpoint: QuestCheckpoint) => {
    setActiveCheckpoint(checkpoint);
  };

  const passCheckpoint = () => {
    if (activeCheckpoint) {
      onCheckpointPassed(quest, activeCheckpoint);
    }
  };

  const completeCheckpoint = (e: MouseEvent) => {
    setActiveCheckpoint(undefined);
    passCheckpoint();
  };

  return (
    <div className="quest-process-display" id="quest-process-display" onClick={clickHandler}>
      <button className="quest-process-display__btn--close" onClick={closeDisplay}></button>
      <div className="quest-process-display__container">
        <div className="quest-process-display__name">{quest.title}</div>

        {activeCheckpoint ? (
          activeCheckpoint.type === CheckpointType.BATTLE ? (
            <BattleProcess
              checkpoint={activeCheckpoint}
              heroes={heroes}
              // checkpointPassed={passCheckpoint}
              moveOnwards={completeCheckpoint}
              closeCheckpoint={() => setActiveCheckpoint(undefined)}
              setHeroRewards={setHeroRewards}
            />
          ) : (
            <CheckpointProcess
              checkpoint={activeCheckpoint}
              heroes={heroes}
              checkpointPassed={passCheckpoint}
              moveOnwards={completeCheckpoint}
              closeCheckpoint={() => setActiveCheckpoint(undefined)}
            />
          )
        ) : quest.progress!.checkpoints.find((c) => !c.passed) ? (
          <QuestMap quest={quest} checkpointActivated={checkpointActivated} />
        ) : (
          <QuestComplete quest={quest} heroes={heroes} />
        )}

        <div className="quest-process-display__heroes-holder">
          {heroes.map((hero) => (
            <HeroItem
              key={hero.id}
              hero={hero}
              enabled={true}
              itemClickHandler={(event) => heroClickHandler(hero, event)}
              reward={heroRewards.get(hero.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

type QuestProcessDisplayContainerProps = {
  activeQuestProcess: QuestProcess;
  heroClicked: (hero: Hero) => void;
  onCheckpointPassed: (quest: Quest, checkpoint: QuestCheckpoint) => void;
  closeQuestProcess: () => void;
};

class QuestProcessDisplayContainer extends Component<QuestProcessDisplayContainerProps> {
  render() {
    const { heroClicked, onCheckpointPassed, closeQuestProcess } = this.props;

    if (!this.props.activeQuestProcess) {
      return null;
    }

    const { quest, heroes } = this.props.activeQuestProcess;

    if (!quest) {
      return <Loader message={`Wating for quest`} />;
    }

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    return (
      <QuestProcessDisplay
        onCheckpointPassed={onCheckpointPassed}
        quest={quest}
        heroes={heroes}
        closeDisplay={closeQuestProcess}
        heroClicked={heroClicked}
      />
    );
  }
}

type QuestProcessDisplayContainerState = {
  activeQuestProcess: QuestProcess;
};

const mapStateToProps = ({ activeQuestProcess }: QuestProcessDisplayContainerState) => {
  return { activeQuestProcess };
};

const mapDispatchToProps = (dispatch: Dispatch, customProps: WithApiServiceProps) => {
  const { apiService, auth } = customProps;
  return bindActionCreators(
    {
      heroClicked: heroStatsChoosed,
      closeQuestProcess,
      onCheckpointPassed: onCheckpointPassed(apiService, auth),
    },
    dispatch
  );
};

export default compose(withApiService(), connect(mapStateToProps, mapDispatchToProps))(QuestProcessDisplayContainer);
