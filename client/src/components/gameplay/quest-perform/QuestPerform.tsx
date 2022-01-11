import React, { Component, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators, compose, Dispatch } from 'redux';
import { clearCheckpointReward, closeQuestPerform } from '../../../actions/Actions';
import { onCheckpointPassed, onCompleteQuest } from '../../../actions/ApiActions';
import withApiService, { WithApiServiceProps } from '../../../hoc/WithApiService';
import Hero from '../../../models/hero/Hero';
import Quest from '../../../models/Quest';
import QuestCheckpoint, { CheckpointStatus, CheckpointType } from '../../../models/QuestCheckpoint';
import { CheckpointPassedBody } from '../../../services/QuestService';
import { shallowCopy } from '../../../utils/Utils';
import Loader from '../../loader/Loader';
import BattleProcess from './battle-process/BattleProcess';
import QuestHero, { HeroAction } from './battle-process/process-helpers/QuestHero';
import HeroesPanel from './heroes-panel/HeroesPanel';
import QuestComplete from './quest-complete/QuestComplete';
import QuestMap from './quest-map/QuestMap';
import './quest-perform.scss';

export type QuestPerformData = {
  quest: Quest;
  heroes: Hero[];
};

type QuestPerformProps = {
  quest: Quest;
  heroes: Hero[];
  onCheckpointPassed: (quest: Quest, result: CheckpointPassedBody) => void;
  onCompleteQuest: (quest: Quest) => void;
  closeDisplay: () => void;
};

const QuestPerform = ({ quest, heroes, onCheckpointPassed, onCompleteQuest, closeDisplay }: QuestPerformProps) => {
  const [activeCheckpoint, setActiveCheckpoint] = useState<QuestCheckpoint>();
  const [, setHeroRewards] = useState<Map<number, { gold: number; experience: number }>>(new Map()); // пока убрал heroRewards чтобы не отсвечивать
  const [heroActors, setHeroActors] = useState<QuestHero[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    setHeroActors(heroes.map((h) => shallowCopy({ ...h, action: HeroAction.ATTACK, statusEffects: [] })));
  }, [heroes, setHeroActors]);

  const checkpointActivated = (checkpoint: QuestCheckpoint) => {
    setActiveCheckpoint(checkpoint);
  };

  const closeProcess = () => {
    setActiveCheckpoint(undefined);
    clearReward();
  };

  const clearReward = () => {
    dispatch(clearCheckpointReward());
  };

  const checkpointPassed = (result: CheckpointPassedBody) => {
    return onCheckpointPassed(quest, result);
  };

  let process;
  if (activeCheckpoint) {
    switch (activeCheckpoint.type) {
      case CheckpointType.BATTLE:
      case CheckpointType.BOSS:
        process = (
          <BattleProcess
            checkpoint={activeCheckpoint}
            propHeroes={heroActors}
            closeProcess={closeProcess}
            checkpointPassed={checkpointPassed}
            updateHeroesState={(heroes: QuestHero[]) => setHeroActors(heroes)}
          />
        );
        break;
      case CheckpointType.TREASURE:
        break;
      default:
        throw new Error(`Unknown checkpoint type ${CheckpointType[activeCheckpoint.type]}`);
    }
  } else {
    process = quest.progress!.checkpoints.find((c) => c.type === CheckpointType.BOSS && c.status === CheckpointStatus.COMPLETED) ? (
      <>
        <QuestComplete quest={quest} heroes={heroes} completeQuest={() => onCompleteQuest(quest)} setHeroRewards={setHeroRewards} />
        <HeroesPanel actors={heroActors} />
      </>
    ) : (
      <>
        <QuestMap quest={quest} checkpointActivated={checkpointActivated} />
        <HeroesPanel actors={heroActors} />
      </>
    );
  }

  const background = activeCheckpoint ? 'battle' : 'camping';

  return (
    <div className={`quest-perform quest-perform__background_${background}`}>
      <div className="quest-perform__container">
        <button
          className="quest-perform__btn-close"
          onClick={() => {
            clearReward();
            closeDisplay();
          }}
        ></button>
        <div className="quest-perform__name">{quest.title}</div>
        {process}
      </div>
    </div>
  );
};

type QuestPerformContainerProps = {
  activeQuestPerform: QuestPerformData;
  onCheckpointPassed: (quest: Quest, checkpoint: CheckpointPassedBody) => void;
  onCompleteQuest: (quest: Quest) => void;
  closeQuestPerform: () => void;
};

class QuestPerformContainer extends Component<QuestPerformContainerProps> {
  render() {
    const { closeQuestPerform, onCheckpointPassed, onCompleteQuest } = this.props;

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
      closeQuestPerform,
      onCheckpointPassed: onCheckpointPassed(apiService, auth),
      onCompleteQuest: onCompleteQuest(apiService, auth),
    },
    dispatch
  );
};

export default compose(withApiService(), connect(mapStateToProps, mapDispatchToProps))(QuestPerformContainer);
