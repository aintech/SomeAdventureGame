import QuestHeroItem from '../quest-hero-item/QuestHeroItem';
import QuestHero, { HeroAction } from '../battle-process/process-helpers/QuestHero';
import './heroes-panel.scss';
import { CheckpointReward } from '../../../../models/QuestCheckpoint';

type HeroesPanelProps = {
  actors: QuestHero[];
  current?: QuestHero;
  showActions?: boolean;
  heroRewards?: CheckpointReward;
  performHeroAction?: (action: HeroAction) => void;
};

const HeroesPanel = ({ actors, current, showActions, heroRewards, performHeroAction }: HeroesPanelProps) => {
  // seed нужен чтобы насильно запустить ререндер иконок героев, чтобы реагировали на противников
  const seed = new Date().getTime();

  const showSkills = () => {};

  const showItems = () => {};

  const heroItems = actors.map((hero) => (
    <QuestHeroItem
      key={hero.id}
      hero={hero}
      current={current?.id === hero.id}
      reward={heroRewards ? heroRewards.rewards?.find((r) => r.heroId === hero.id) : undefined}
      seed={seed}
    />
  ));

  return (
    <div className="heroes-panel">
      <div className="heroes-panel__heroes">{heroItems}</div>
      <div className={`heroes-panel__hero-actions ${showActions ? '' : 'heroes-panel__hero-actions_hidden'}`}>
        <div className="heroes-panel__hero-action heroes-panel__hero-action_skill" onClick={() => showSkills()}></div>
        <div className="heroes-panel__hero-action heroes-panel__hero-action_item" onClick={() => showItems()}></div>
        <div
          className="heroes-panel__hero-action heroes-panel__hero-action_defence"
          onClick={() => performHeroAction!(HeroAction.DEFENCE)}
        ></div>
      </div>
    </div>
  );
};

export default HeroesPanel;
