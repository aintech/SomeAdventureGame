import { BattleMessage } from '../process-models/BattleMessage';
import CheckpointActor from '../process-models/CheckpointActor';
import { StatusEffectType } from '../process-models/StatusEffect';
import './monster-item.scss';

type MonsterItemProps = {
  monster: CheckpointActor;
  idx: number;
  messages: BattleMessage[];
  handleClickMonster: (monster: CheckpointActor) => void;
};

// TODO: Анимация урона противнику сейчас сделана через attack.gif,
// надо переправить так чтобы анимация не зависела от гифки, т.к. тайминги не совпадают.
// например играть анимацию через setTimeout

const MonsterItem = ({ monster, idx, messages, handleClickMonster }: MonsterItemProps) => {
  const healthPercent = (monster.health / monster.totalHealth) * 100;
  const barLength = monster.totalHealth * 0.5;

  /** верхний пустой div нужен чтобы картинки не перекрывали друг друга и на врага во втором ряду можно было кликнуть */
  return (
    <div>
      <div
        className="monster-item"
        style={{ zIndex: idx % 2, marginTop: `${(idx % 2) * 40}px` }}
        onClick={() => handleClickMonster(monster)}
      >
        <div className="monster-item__messages">
          {messages.map((m) => (
            <div key={m.id} className="monster-item__message">
              {m.message}
            </div>
          ))}
        </div>
        {monster.health > 0 ? (
          <>
            <div className="monster-item__bar-holder" style={{ width: `${barLength}px` }}>
              <div className="monster-item__bar monster-item__bar_health" style={{ width: `${healthPercent}%` }}>
                <div className="monster-item__bar_overlay"></div>
              </div>
            </div>
            <div className="monster-item__status-holder">
              {monster.statusEffects.map((eff) => (
                <div key={eff.id} className={`monster-item__status monster-item__status_${StatusEffectType[eff.type].toLowerCase()}`}></div>
              ))}
            </div>
            <div
              className={`monster-item__display monster-item__display_${monster.name}${monster.hitted ? '_hit' : ''}
              ${monster.hitted ? ' monster-item__display_hitted' : ''}`}
              style={{ zIndex: idx % 2 }}
            ></div>
            <div className="monster-item__display_hit-anim" style={{ display: `${monster.hitted ? 'flex' : 'none'}` }}></div>
          </>
        ) : (
          <div className="monster-item__defeated"></div>
        )}
      </div>
    </div>
  );
};

export default MonsterItem;
