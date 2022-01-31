import { MouseEvent, useState } from 'react';
import Hero from '../../../../models/hero/Hero';
import HeroSkill, { HeroSkillType, TargetType } from '../../../../models/hero/HeroSkill';
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
  skillUsed?: (initiator: QuestHero, target: QuestHero | CheckpointActor, skill: HeroSkill) => void;
  setActionDecription?: (description?: string) => void;
  actionDescription?: string;
};

const HeroesPanel = ({
  actors,
  current,
  showActions,
  heroRewards,
  messages,
  actionChanged,
  itemUsed,
  skillUsed,
  setActionDecription,
  actionDescription,
}: HeroesPanelProps) => {
  const [items, setItems] = useState<HeroItem[]>([]);
  const [skills, setSkills] = useState<HeroSkill[]>([]);

  // seed нужен чтобы насильно запустить ререндер иконок героев, чтобы реагировали на противников
  const seed = new Date().getTime();

  const toggleSkills = () => {
    if (current) {
      if (current.action.type === BattleActionType.OPEN_SKILLS) {
        actionChanged!({ type: BattleActionType.ATTACK });
        setSkills([]);
      } else {
        actionChanged!({ type: BattleActionType.OPEN_SKILLS });
        setSkills(current.skills.sort((a, b) => a.type - b.type));
        setItems([]);
      }
    }
  };

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
        setSkills([]);
      }
    }
  };

  const handleItemClick = (e: MouseEvent, item: HeroItem) => {
    e.stopPropagation();
    setItems([]);

    if (item.target === TargetType.ENEMY || item.target === TargetType.HERO) {
      setActionDecription!(item.description);
    }

    actionChanged!({ type: BattleActionType.USE_ITEM, item });
  };

  const handleSkillClick = (e: MouseEvent, skill: HeroSkill) => {
    e.stopPropagation();

    if ((current?.mana ?? Number.MAX_SAFE_INTEGER) < skill.mana) {
      return;
    }

    setSkills([]);

    if (skill.target === TargetType.ENEMY || skill.target === TargetType.HERO) {
      setActionDecription!(skill.description);
    }

    actionChanged!({ type: BattleActionType.USE_SKILL, skill });
  };

  const handleDefence = () => {
    if (current) {
      setItems([]);
      actionChanged!({ type: BattleActionType.DEFENCE });
    }
  };

  const handleHeroClick = (hero: Hero | QuestHero) => {
    if (current?.action?.type === BattleActionType.USE_ITEM) {
      if (current.action.item?.target === TargetType.HERO) {
        itemUsed!(current, hero as QuestHero, current.action.item!);
        setActionDecription!(undefined);
        return true;
      }
    }

    if (current?.action?.type === BattleActionType.USE_SKILL) {
      if (current.action.skill?.target === TargetType.HERO) {
        skillUsed!(current, hero as QuestHero, current.action.skill!);
        setActionDecription!(undefined);
        return true;
      }
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

      {skills.length > 0 ? (
        <div className="heroes-panel__skills">
          {skills.map((skill) => (
            <div
              key={skill.type}
              className={`heroes-panel__skill heroes-panel__skill--${HeroSkillType[skill.type].toLowerCase()}
              ${(current?.mana ?? 0) >= skill.mana ? '' : ' heroes-panel__skill_disabled'}`}
              onClick={(e) => handleSkillClick(e, skill)}
            ></div>
          ))}
        </div>
      ) : null}

      <div className="heroes-panel__heroes">{heroItems}</div>
      <div
        className={`heroes-panel__hero-actions
          ${!actionDescription ? '' : ' heroes-panel--hidden'}
          ${showActions ? '' : ' heroes-panel--disabled'}`}
      >
        <div className="heroes-panel__hero-action heroes-panel__hero-action_skill" onClick={() => toggleSkills()}></div>
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
