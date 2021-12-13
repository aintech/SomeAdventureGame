import QuestHeroItem from '../quest-hero-item/QuestHeroItem';
import QuestHero from '../quest-processes/process-helpers/QuestHero';
import { HeroReactionType } from '../QuestPerform';
import './heroes-panel.scss';

type HeroesPanelProps = {
  actors: QuestHero[];
  current?: QuestHero;
  showActions?: boolean;
  reacted?: Map<HeroReactionType, number[]>;
  heroRewards?: Map<number, { gold: number; experience: number }>;
  heroHittedMemo?: number[];
  heroHealedMemo?: number[];
};

const HeroesPanel = ({ actors, current, showActions, reacted, heroHittedMemo, heroHealedMemo, heroRewards }: HeroesPanelProps) => {
  const handleActionClick = (type: string) => {};

  return (
    <div className="heroes-panel">
      <div className="heroes-panel__heroes">
        {actors.map((hero) => (
          <QuestHeroItem
            key={hero.id}
            hero={hero}
            current={current?.id === hero.id}
            hitted={!reacted?.get(HeroReactionType.HITTED)?.includes(hero.id) ? undefined : heroHittedMemo?.includes(hero.id)}
            healed={!reacted?.get(HeroReactionType.HEALED)?.includes(hero.id) ? undefined : heroHealedMemo?.includes(hero.id)}
            reward={heroRewards?.get(hero.id)}
          />
        ))}
      </div>
      <div className={`heroes-panel__hero-actions ${showActions ? '' : 'heroes-panel__hero-actions_hidden'}`}>
        <div className="heroes-panel__hero-action heroes-panel__hero-action_attack" onClick={() => handleActionClick('ATK')}>
          ATK
        </div>
        <div className="heroes-panel__hero-action heroes-panel__hero-action_skill" onClick={() => handleActionClick('SKL')}>
          SKL
        </div>
        <div className="heroes-panel__hero-action heroes-panel__hero-action_item" onClick={() => handleActionClick('ITM')}>
          ITM
        </div>
        <div className="heroes-panel__hero-action heroes-panel__hero-action_defence" onClick={() => handleActionClick('DEF')}>
          DEF
        </div>
      </div>
    </div>
  );
};

export default HeroesPanel;
