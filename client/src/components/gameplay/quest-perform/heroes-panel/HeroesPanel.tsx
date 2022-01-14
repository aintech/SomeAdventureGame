import { useState } from 'react';
import { HeroItem } from '../../../../models/Item';
import { CheckpointReward } from '../../../../models/QuestCheckpoint';
import { BattleAction } from '../process-models/BattleAction';
import { BattleMessage } from '../process-models/BattleMessage';
import QuestHero from '../process-models/QuestHero';
import QuestHeroItem from '../quest-hero-item/QuestHeroItem';
import './heroes-panel.scss';

type HeroesPanelProps = {
  actors: QuestHero[];
  current?: QuestHero;
  showActions?: boolean;
  heroRewards?: CheckpointReward;
  messages?: BattleMessage[];
  performBattleAction?: (action: BattleAction) => void;
};

const HeroesPanel = ({ actors, current, showActions, heroRewards, messages, performBattleAction }: HeroesPanelProps) => {
  const [items, setItems] = useState<HeroItem[]>([]);

  // seed нужен чтобы насильно запустить ререндер иконок героев, чтобы реагировали на противников
  const seed = new Date().getTime();

  const showSkills = () => {};

  const toggleItems = () => {
    if (current) {
      if (current.items.length === 0) {
        return;
      }
      if (current.action === BattleAction.CHOOSING_SKILL_ITEM) {
        performBattleAction!(BattleAction.ATTACK);
        setItems([]);
      } else {
        performBattleAction!(BattleAction.CHOOSING_SKILL_ITEM);
        setItems(current.items);
      }
    }
  };

  const handleDefence = () => {
    setItems([]);
    performBattleAction!(BattleAction.DEFENCE);
  };

  const heroItems = actors.map((hero) => (
    <QuestHeroItem
      key={hero.id}
      hero={hero}
      current={current?.id === hero.id}
      reward={heroRewards ? heroRewards.rewards?.find((r) => r.heroId === hero.id) : undefined}
      messages={messages?.filter((msg) => msg.actorId === hero.id)}
      seed={seed}
    />
  ));

  return (
    <div className="heroes-panel">
      <div className="heroes-panel__items">
        {items.map((item) => (
          <div key={item.id} className="heroes-panel__item">
            {item.name}
          </div>
        ))}
      </div>
      <div className="heroes-panel__heroes">{heroItems}</div>
      <div className={`heroes-panel__hero-actions ${showActions ? '' : 'heroes-panel__hero-actions_hidden'}`}>
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
