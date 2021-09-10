import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { closeQuestProcess, heroStatsChoosed } from "../../../actions/Actions";
import { onCheckpointPassed } from "../../../actions/ApiActions";
import withApiService, { WithApiServiceProps } from "../../../hoc/WithApiService";
import Hero from "../../../models/hero/Hero";
import Quest from "../../../models/Quest";
import QuestCheckpoint, { CheckpointType } from "../../../models/QuestCheckpoint";
import { CheckpointPassedBody } from "../../../services/QuestsService";
import { shallowCopy } from "../../../utils/Utils";
import Loader from "../../loader/Loader";
import HeroItem from "../village-building-display/guild-display/heroes/hero-item/HeroItem";
import BattleProcess, { HeroEvent } from "./battle-process/BattleProcess";
import QuestComplete from "./quest-complete/QuestComplete";
import QuestMap from "./quest-map/QuestMap";
import "./quest-process-display.scss";
import TreasureProcess from "./treasure-process/TreasureProcess";

export type QuestProcess = {
  quest: Quest;
  heroes: Hero[];
};

type QuestProcessDisplayProps = {
  quest: Quest;
  heroes: Hero[];
  heroClicked: (hero: Hero) => void;
  onCheckpointPassed: (quest: Quest, result: CheckpointPassedBody) => void;
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
  const [heroActors, setHeroActors] = useState<Hero[]>([]);
  const [hitted, setHitted] = useState<number>(-1);

  useEffect(() => {
    setHeroActors(heroes.map((h) => shallowCopy(h)));
  }, [heroes, setHeroActors]);

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

  const completeCheckpoint = (
    won: boolean,
    collectedDrops: Map<number, number[]>,
    battleEvents: Map<number, HeroEvent[]>
  ) => {
    setActiveCheckpoint(undefined);
    setHeroRewards(new Map());
    if (activeCheckpoint && won) {
      const collected = Array.from(collectedDrops, ([actorId, drops]) => ({ actorId, drops }));
      const events = Array.from(battleEvents, ([heroId, events]) => ({ heroId, events }));
      onCheckpointPassed(quest, { id: activeCheckpoint.id, collected, events });
    }
    if (!won) {
      setHeroActors(heroes.map((h) => shallowCopy(h)));
    }
  };

  const heroHit = (heroId: number, hpLoss: number) => {
    const actors = [...heroActors];
    const hero = actors.find((h) => h.id === heroId)!;
    hero.health -= hpLoss;
    if (hero.health < 0) {
      hero.health = 0;
    }
    setHeroActors(actors);
    setHitted(hero.id);
  };

  let display;
  if (activeCheckpoint) {
    switch (activeCheckpoint.type) {
      case CheckpointType.BATTLE:
        display = (
          <BattleProcess
            checkpoint={activeCheckpoint}
            heroes={heroActors}
            heroHit={heroHit}
            resetAnim={() => setHitted(-1)}
            // checkpointPassed={passCheckpoint}
            moveOnwards={completeCheckpoint}
            closeCheckpoint={() => setActiveCheckpoint(undefined)}
            setHeroRewards={setHeroRewards}
          />
        );
        break;
      case CheckpointType.TREASURE:
        display = (
          <TreasureProcess
            checkpoint={activeCheckpoint}
            heroes={heroActors}
            // checkpointPassed={() => {}}
            moveOnwards={() => {
              setActiveCheckpoint(undefined);
              onCheckpointPassed(quest, { id: activeCheckpoint.id });
            }}
            closeCheckpoint={() => setActiveCheckpoint(undefined)}
            setHeroRewards={setHeroRewards}
          />
        );
        break;
      default:
        throw new Error(`Unknown checkpoint type ${CheckpointType[activeCheckpoint.type]}`);
    }
  } else {
    display = quest.progress!.checkpoints.find((c) => !c.passed) ? (
      <QuestMap quest={quest} checkpointActivated={checkpointActivated} />
    ) : (
      <QuestComplete quest={quest} heroes={heroes} />
    );
  }

  return (
    <div className="quest-process-display" id="quest-process-display" onClick={clickHandler}>
      <button className="quest-process-display__btn--close" onClick={closeDisplay}></button>
      <div className="quest-process-display__container">
        <div className="quest-process-display__name">{quest.title}</div>

        {display}

        <div className="quest-process-display__heroes-holder">
          {heroActors.map((hero) => (
            <HeroItem
              key={hero.id}
              hero={hero}
              enabled={true}
              hitted={hitted === hero.id}
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
  onCheckpointPassed: (quest: Quest, checkpoint: CheckpointPassedBody) => void;
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
