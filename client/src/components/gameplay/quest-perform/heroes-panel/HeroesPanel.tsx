import Hero from '../../../../models/hero/Hero';
import QuestHeroItem from '../quest-hero-item/QuestHeroItem';
import { HeroReactionType } from '../QuestPerform';
import './heroes-panel.scss';

type HeroesPanelProps = {
  actors: Hero[];
  showActions?: boolean;
  reacted?: Map<HeroReactionType, number[]>;
  heroRewards?: Map<number, { gold: number; experience: number }>;
  heroHittedMemo?: number[];
  heroHealedMemo?: number[];
};

const HeroesPanel = ({ actors, showActions, reacted, heroHittedMemo, heroHealedMemo, heroRewards }: HeroesPanelProps) => {
  return (
    <div className="heroes-panel">
      <div className="heroes-panel__heroes">
        {actors.map((hero) => (
          <QuestHeroItem
            key={hero.id}
            hero={hero}
            hitted={!reacted?.get(HeroReactionType.HITTED)?.includes(hero.id) ? undefined : heroHittedMemo?.includes(hero.id)}
            healed={!reacted?.get(HeroReactionType.HEALED)?.includes(hero.id) ? undefined : heroHealedMemo?.includes(hero.id)}
            reward={heroRewards?.get(hero.id)}
          />
        ))}
      </div>
      <div className={`heroes-panel__hero-actions ${showActions ? '' : 'heroes-panel__hero-actions_hidden'}`}></div>
    </div>
  );
};

export default HeroesPanel;
