import { MouseEvent, useState } from 'react';
import Hero from '../../../../models/hero/Hero';
import { HeroItem, ItemSubtype } from '../../../../models/Item';
import { CheckpointReward } from '../../../../models/QuestCheckpoint';
import { BattleAction, BattleActionType } from '../process-models/BattleAction';
import { BattleMessage } from '../process-models/BattleMessage';
import CheckpointActor from '../process-models/CheckpointActor';
import QuestHero from '../process-models/QuestHero';
import QuestHeroItem from '../quest-hero-item/QuestHeroItem';
import './heroes-panel.scss';

type HeroesPanelProps = {
  actors: QuestHero[];
  current?: QuestHero;
  showActions?: boolean;
  heroRewards?: CheckpointReward;
  messages?: BattleMessage[];
  actionChanged?: (action: BattleAction) => void;
  itemUsed?: (initiator: QuestHero, target: QuestHero | CheckpointActor, item: HeroItem) => void;
};

const HeroesPanel = ({ actors, current, showActions, heroRewards, messages, actionChanged, itemUsed }: HeroesPanelProps) => {
  const [items, setItems] = useState<HeroItem[]>([]);
  const [actionMsg, setActionMessage] = useState<string>();

  // seed нужен чтобы насильно запустить ререндер иконок героев, чтобы реагировали на противников
  const seed = new Date().getTime();

  const showSkills = () => {};

  const toggleItems = () => {
    if (current) {
      if (current.items.length === 0) {
        return;
      }
      if (current.action.type === BattleActionType.OPEN_BACKPACK) {
        actionChanged!({ type: BattleActionType.ATTACK });
        setItems([]);
      } else {
        actionChanged!({ type: BattleActionType.OPEN_BACKPACK });
        setItems(current.items.sort((a, b) => a.id - b.id));
      }
    }
  };

  const handleItemClick = (e: MouseEvent, item: HeroItem) => {
    e.stopPropagation();
    setItems([]);

    switch (item.subtype) {
      case ItemSubtype.HEALTH_POTION:
        setActionMessage('Восстанавливает 50% HP выбранному герою');
        break;
      case ItemSubtype.HEALTH_ELIXIR:
        setActionMessage('Полностью восстановить HP выбранному герою');
        break;
      default:
        throw new Error(`Unknown item subtype ${ItemSubtype[item.subtype]}`);
    }

    actionChanged!({ type: BattleActionType.USE_ITEM, item });
  };

  const handleDefence = () => {
    setItems([]);
    actionChanged!({ type: BattleActionType.DEFENCE });
  };

  const handleHeroClick = (hero: Hero | QuestHero) => {
    if (current?.action?.type === BattleActionType.USE_ITEM) {
      itemUsed!(current!, hero as QuestHero, current.action.item!);
      setActionMessage(undefined);
      return true;
    }
    return false;
  };

  const heroItems = actors.map((hero) => (
    <QuestHeroItem
      key={hero.id}
      hero={hero}
      current={current?.id === hero.id}
      reward={heroRewards ? heroRewards.rewards?.find((r) => r.heroId === hero.id) : undefined}
      messages={messages?.filter((msg) => msg.actorId === hero.id)}
      seed={seed}
      overrideClickHandler={handleHeroClick}
    />
  ));

  return (
    <div className="heroes-panel">
      {items.length > 0 ? (
        <div className="heroes-panel__backpack">
          <div className="heroes-panel__backpack_content">
            {items
              .filter((i) => i.amount > 0)
              .map((item) => (
                <div
                  key={item.id}
                  className={`heroes-panel__item heroes-panel__item--${ItemSubtype[item.subtype].toLowerCase()}`}
                  onClick={(e) => handleItemClick(e, item)}
                >
                  <p className="heroes-panel__item_amount">{item.amount}</p>
                </div>
              ))}
          </div>
        </div>
      ) : null}
      <div className="heroes-panel__heroes">{heroItems}</div>
      <div className={`heroes-panel__action-msg${actionMsg ? '' : ' heroes-panel_hidden'}`}>
        <div className="heroes-panel__action-msg_message">{actionMsg}</div>
        <button
          className="heroes-panel__action-msg_close-btn"
          onClick={() => {
            setActionMessage(undefined);
            actionChanged!({ type: BattleActionType.ATTACK });
          }}
        >
          x
        </button>
      </div>
      <div className={`heroes-panel__hero-actions${showActions && !actionMsg ? '' : ' heroes-panel_hidden'}`}>
        <div className="heroes-panel__hero-action heroes-panel__hero-action_skill" onClick={() => showSkills()}></div>
        <div
          className={`heroes-panel__hero-action heroes-panel__hero-action_item${
            current?.items.length === 0 ? ' heroes-panel__hero-action_disabled' : ''
          }`}
          onClick={() => toggleItems()}
        ></div>
        <div className="heroes-panel__hero-action heroes-panel__hero-action_defence" onClick={handleDefence}></div>
      </div>
    </div>
  );
};

export default HeroesPanel;
