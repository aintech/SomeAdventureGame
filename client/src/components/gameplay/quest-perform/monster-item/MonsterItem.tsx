import CheckpointActor from '../quest-processes/process-helpers/CheckpointActor';
import './monster-item.scss';

type MonsterItemProps = {
  monster: CheckpointActor;
  idx: number;
  handleClickMonster: (monster: CheckpointActor) => void;
};

const MonsterItem = ({ monster, idx, handleClickMonster }: MonsterItemProps) => {
  const healthPercent = (monster.currentHealth / monster.totalHealth) * 100;

  return (
    <div>
      {' '}
      {/** этот div нужен чтобы картинки не перекрывали друг друга и на врага во втором ряду можно было кликнут */}
      <div
        className="monster-item"
        style={{ zIndex: idx % 2, marginTop: `${(idx % 2) * 40}px`, gridColumn: idx + 1 }}
        onClick={() => handleClickMonster(monster)}
      >
        {monster.name}
        <div className="monster-item__bar-holder">
          <div className="monster-item__bar monster-item__bar_health" style={{ width: `${healthPercent}%` }}>
            <div className="monster-item__bar_overlay"></div>
          </div>
        </div>
        <div
          className={`monster-item__display_${monster.name}${monster.hitted ? ' monster-item__display_hitted' : ''}`}
          style={{ zIndex: idx % 2 }}
        ></div>
      </div>
    </div>
  );
};

export default MonsterItem;
