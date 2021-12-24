import QuestHeroItem from '../quest-hero-item/QuestHeroItem';
import QuestHero from '../battle-process/process-helpers/QuestHero';
import './heroes-panel.scss';

type HeroesPanelProps = {
  actors: QuestHero[];
  current?: QuestHero;
  showActions?: boolean;
  heroRewards?: Map<number, { gold: number; experience: number }>;
};

const HeroesPanel = ({ actors, current, showActions, heroRewards }: HeroesPanelProps) => {
  const handleActionClick = (type: string) => {};

  // seed нужен чтобы насильно запустить ререндер иконок героев, чтобы реагировали на противников
  const seed = new Date().getTime();

  const heroItems = actors.map((hero) => (
    <QuestHeroItem key={hero.id} hero={hero} current={current?.id === hero.id} reward={heroRewards?.get(hero.id)} seed={seed} />
  ));

  return (
    <div className="heroes-panel">
      <div className="heroes-panel__heroes">{heroItems}</div>
      <div className={`heroes-panel__hero-actions ${showActions ? '' : 'heroes-panel__hero-actions_hidden'}`}>
        <div
          className="heroes-panel__hero-action heroes-panel__hero-action_attack heroes-panel__hero-action_active"
          onClick={() => handleActionClick('ATK')}
        >
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
