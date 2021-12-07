import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose, Dispatch } from 'redux';
import { closeQuestPerform, heroStatsChoosed } from '../../../actions/Actions';
import { onCheckpointPassed, onCompleteQuest } from '../../../actions/ApiActions';
import withApiService, { WithApiServiceProps } from '../../../hoc/WithApiService';
import Hero, { maxHealth } from '../../../models/hero/Hero';
import Quest from '../../../models/Quest';
import QuestCheckpoint, { CheckpointType } from '../../../models/QuestCheckpoint';
import { CheckpointPassedBody } from '../../../services/QuestService';
import { shallowCopy } from '../../../utils/Utils';
import Loader from '../../loader/Loader';
import QuestComplete from './quest-complete/QuestComplete';
import QuestHeroItem from './quest-hero-item/QuestHeroItem';
import QuestMap from './quest-map/QuestMap';
import './quest-perform.scss';
import ClickerProcess, { HeroEvent } from './quest-processes/clicker-process/ClickerProcess';
import TreasureProcess from './quest-processes/treasure-process/TreasureProcess';

export enum HeroReactionType {
  HITTED,
  HEALED,
}

const initialReactions = () => {
  const initials: Map<HeroReactionType, number[]> = new Map();
  initials.set(HeroReactionType.HITTED, []);
  initials.set(HeroReactionType.HEALED, []);
  return initials;
};

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

  const [reacted, setReacted] = useState<Map<HeroReactionType, number[]>>(initialReactions());

  // Т.к. герой может реагировать каждый раунд пришлось придумать такую переключалку
  // иначе анимация не поймёт что ей надо переиграть, т.к. класс в HeroItem уже будет выставлен в анимацию
  const [heroHittedMemo, setHeroHittedMemo] = useState<number[]>([]);
  const [heroHealedMemo, setHeroHealedMemo] = useState<number[]>([]);

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

  const heroesReactions = (reactions: Map<number, Map<HeroReactionType, number>>) => {
    const actors = [...heroActors];
    const toReacted = initialReactions();

    reactions.forEach((reaction, heroId) => {
      const hero = actors.find((h) => h.id === heroId)!;

      let healthAdjust = 0;

      reaction.forEach((amount, type) => {
        if (!toReacted.get(type)!.includes(heroId)) {
          toReacted.get(type)!.push(heroId);
        }
        healthAdjust += amount;
      });

      hero.health += healthAdjust;
      if (hero.health < 0) {
        hero.health = 0;
      }
      if (hero.health > maxHealth(hero)) {
        hero.health = maxHealth(hero);
      }
    });

    if (reactions.size > 0) {
      const toHitted = [...heroHittedMemo];
      const toHealed = [...heroHealedMemo];

      toReacted.get(HeroReactionType.HITTED)!.forEach((heroId) => {
        if (toHitted.includes(heroId)) {
          const idx = toHitted.indexOf(heroId);
          toHitted.splice(idx, 1);
        } else {
          toHitted.push(heroId);
        }
      });

      toReacted.get(HeroReactionType.HEALED)!.forEach((heroId) => {
        if (toHealed.includes(heroId)) {
          const idx = toHealed.indexOf(heroId);
          toHealed.splice(idx, 1);
        } else {
          toHealed.push(heroId);
        }
      });

      setHeroActors(actors);
      setReacted(toReacted);
      setHeroHittedMemo(toHitted);
      setHeroHealedMemo(toHealed);
    }
  };

  let process;
  if (activeCheckpoint) {
    switch (activeCheckpoint.type) {
      case CheckpointType.BATTLE:
        process = (
          <ClickerProcess
            checkpoint={activeCheckpoint}
            heroes={heroActors}
            heroesReactions={heroesReactions}
            resetAnim={() => {
              setReacted(initialReactions());
            }}
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
        <button className="quest-perform__btn-close" onClick={closeDisplay}></button>
        <div className="quest-perform__name">{quest.title}</div>
        {process}
        <div className="quest-perform__heroes-holder">
          {heroActors.map((hero) => (
            <QuestHeroItem
              key={hero.id}
              hero={hero}
              hitted={!reacted.get(HeroReactionType.HITTED)!.includes(hero.id) ? undefined : heroHittedMemo.includes(hero.id)}
              healed={!reacted.get(HeroReactionType.HEALED)!.includes(hero.id) ? undefined : heroHealedMemo.includes(hero.id)}
              itemClickHandler={(event) => heroClickHandler(hero, event)}
              reward={heroRewards.get(hero.id)}
            />
          ))}
        </div>
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
