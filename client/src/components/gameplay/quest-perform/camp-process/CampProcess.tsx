import { useEffect } from 'react';
import QuestCheckpoint from '../../../../models/QuestCheckpoint';
import { CheckpointPassedBody } from '../../../../services/QuestService';
import QuestHero from '../process-models/QuestHero';
import './camp-process.scss';

type CampProcessProps = {
  checkpoint: QuestCheckpoint;
  heroes: QuestHero[];
  updateHeroesState: (heroes: QuestHero[]) => void;
  checkpointPassed: (result: CheckpointPassedBody) => void;
  closeProcess: () => void;
};

const CampProcess = ({ checkpoint, heroes, updateHeroesState, checkpointPassed, closeProcess }: CampProcessProps) => {
  useEffect(() => {
    heroes.forEach((h) => {
      h.health = h.stats.vitality * 10;
    });
    updateHeroesState(heroes);
    checkpointPassed({ id: checkpoint.id });
  });

  return (
    <div className="camp-process">
      <p className="camp-process__message">Привал</p>

      <div className="camp-process__description">Вы нашли небольшой закуток, в котором можно спокойно восстановить здоровье и ману.</div>

      <button className="camp-process__btn-onwards" onClick={() => closeProcess()}>
        Вернуться к карте
      </button>
    </div>
  );
};

export default CampProcess;
