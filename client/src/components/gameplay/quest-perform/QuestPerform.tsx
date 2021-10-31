import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { closeQuestPerform, heroStatsChoosed } from "../../../actions/Actions";
import { onCheckpointPassed, onCompleteQuest } from "../../../actions/ApiActions";
import withApiService, { WithApiServiceProps } from "../../../hoc/WithApiService";
import Hero, { maxHealth } from "../../../models/hero/Hero";
import Quest from "../../../models/Quest";
import QuestCheckpoint, { CheckpointType } from "../../../models/QuestCheckpoint";
import { CheckpointPassedBody } from "../../../services/QuestService";
import { shallowCopy } from "../../../utils/Utils";
import Loader from "../../loader/Loader";
import HeroItem from "../building-display/guild-display/heroes/hero-item/HeroItem";
import BattleProcess, { HeroEvent } from "./quest-processes/battle-process/BattleProcess";
import QuestComplete from "./quest-complete/QuestComplete";
import QuestMap from "./quest-map/QuestMap";
import "./quest-perform.scss";
import TreasureProcess from "./quest-processes/treasure-process/TreasureProcess";

export enum HeroReactionType {
  HIT,
  HEAL,
}

export type QuestPerformData = {
  quest: Quest;
  heroes: Hero[];
};

type QuestPerformProps = {
  quest: Quest;
  heroes: Hero[];
  heroClicked: (hero: Hero) => void;
  onCheckpointPassed: (quest: Quest, result: CheckpointPassedBody) => void;
  onCompleteQuest: (quest: Quest) => void;
  closeDisplay: () => void;
};

const QuestPerform = ({ quest, heroes, heroClicked, onCheckpointPassed, onCompleteQuest, closeDisplay }: QuestPerformProps) => {
  const [activeCheckpoint, setActiveCheckpoint] = useState<QuestCheckpoint>();
  const [heroRewards, setHeroRewards] = useState<Map<number, { gold: number; experience: number }>>(new Map());
  const [heroActors, setHeroActors] = useState<Hero[]>([]);
  const [hitted, setHitted] = useState<number>(-1);
  const [healed, setHealed] = useState<number>(-1);

  useEffect(() => {
    setHeroActors(heroes.map((h) => shallowCopy(h)));
  }, [heroes, setHeroActors]);

  const heroClickHandler = (hero: Hero, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    heroClicked(hero);
  };

  const checkpointActivated = (checkpoint: QuestCheckpoint) => {
    setActiveCheckpoint(checkpoint);
  };

  const completeCheckpoint = (won: boolean, collectedDrops: Map<number, number[]>, battleEvents: Map<number, HeroEvent[]>) => {
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

  const heroReaction = (heroId: number, type: HeroReactionType, amount: number) => {
    const actors = [...heroActors];
    const hero = actors.find((h) => h.id === heroId)!;
    hero.health += amount;
    if (hero.health < 0) {
      hero.health = 0;
    }
    if (hero.health > maxHealth(hero)) {
      hero.health = maxHealth(hero);
    }
    setHeroActors(actors);
    switch (type) {
      case HeroReactionType.HIT:
        setHitted(heroId);
        break;
      case HeroReactionType.HEAL:
        setHealed(heroId);
        break;
      default:
        throw new Error(`Unknown reaction type ${HeroReactionType[type]}`);
    }
  };

  let process;
  if (activeCheckpoint) {
    switch (activeCheckpoint.type) {
      case CheckpointType.BATTLE:
        process = (
          <BattleProcess
            checkpoint={activeCheckpoint}
            heroes={heroActors}
            heroReaction={heroReaction}
            resetAnim={() => {
              setHitted(-1);
              setHealed(-1);
            }}
            // checkpointPassed={passCheckpoint}
            moveOnwards={completeCheckpoint}
            closeCheckpoint={() => setActiveCheckpoint(undefined)}
            setHeroRewards={setHeroRewards}
          />
        );
        break;
      case CheckpointType.TREASURE:
        process = (
          <TreasureProcess
            checkpoint={activeCheckpoint}
            heroes={heroActors}
            // checkpointPassed={() => {}}
            moveOnwards={(collected: { actorId: number; drops: number[] }[]) => {
              setActiveCheckpoint(undefined);
              setHeroRewards(new Map());
              onCheckpointPassed(quest, { id: activeCheckpoint.id, collected });
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
    process = quest.progress!.checkpoints.find((c) => !c.passed) ? (
      <QuestMap quest={quest} checkpointActivated={checkpointActivated} />
    ) : (
      <QuestComplete quest={quest} heroes={heroes} completeQuest={() => onCompleteQuest(quest)} setHeroRewards={setHeroRewards} />
    );
  }

  return (
    <div className="quest-perform">
      <div className="quest-perform__container">
        <button className="quest-perform__btn--close" onClick={closeDisplay}></button>
        <div className="quest-perform__name">{quest.title}</div>
        <div className="quest-perform__heroes-holder">
          {heroActors.map((hero) => (
            <HeroItem
              key={hero.id}
              hero={hero}
              enabled={true}
              hitted={hitted === hero.id}
              healed={healed === hero.id}
              itemClickHandler={(event) => heroClickHandler(hero, event)}
              reward={heroRewards.get(hero.id)}
            />
          ))}
        </div>
        {process}
      </div>
    </div>
  );
};

type QuestPerformContainerProps = {
  activeQuestPerform: QuestPerformData;
  heroClicked: (hero: Hero) => void;
  onCheckpointPassed: (quest: Quest, checkpoint: CheckpointPassedBody) => void;
  onCompleteQuest: (quest: Quest) => void;
  closeQuestPerform: () => void;
};

class QuestPerformContainer extends Component<QuestPerformContainerProps> {
  render() {
    const { heroClicked, closeQuestPerform, onCheckpointPassed, onCompleteQuest } = this.props;

    if (!this.props.activeQuestPerform) {
      return null;
    }

    const { quest, heroes } = this.props.activeQuestPerform;

    if (!quest) {
      return <Loader message={`Wating for quest`} />;
    }

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    return (
      <QuestPerform
        quest={quest}
        heroes={heroes}
        closeDisplay={closeQuestPerform}
        heroClicked={heroClicked}
        onCheckpointPassed={onCheckpointPassed}
        onCompleteQuest={onCompleteQuest}
      />
    );
  }
}

type QuestPerformContainerState = {
  activeQuestPerform: QuestPerformData;
};

const mapStateToProps = ({ activeQuestPerform }: QuestPerformContainerState) => {
  return { activeQuestPerform };
};

const mapDispatchToProps = (dispatch: Dispatch, customProps: WithApiServiceProps) => {
  const { apiService, auth } = customProps;
  return bindActionCreators(
    {
      heroClicked: heroStatsChoosed,
      closeQuestPerform,
      onCheckpointPassed: onCheckpointPassed(apiService, auth),
      onCompleteQuest: onCompleteQuest(apiService, auth),
    },
    dispatch
  );
};

export default compose(withApiService(), connect(mapStateToProps, mapDispatchToProps))(QuestPerformContainer);
