import HeroSkill from '../../../../models/hero/HeroSkill';
import { HeroItem } from '../../../../models/Item';

export enum BattleActionType {
  ATTACK,
  DEFENCE,

  OPEN_BACKPACK,
  OPEN_SKILLS,

  USE_ITEM,
  USE_SKILL,
}

export type BattleAction = {
  type: BattleActionType;
  item?: HeroItem;
  skill?: HeroSkill;
};

/**
 * Активное действие подразумевает что при его выборе переключается следующий раунд.
 */
export const isActive = (type: BattleActionType) => {
  switch (type) {
    case BattleActionType.DEFENCE:
      return true;

    case BattleActionType.ATTACK:
    case BattleActionType.OPEN_BACKPACK:
    case BattleActionType.OPEN_SKILLS:
    case BattleActionType.USE_ITEM:
    case BattleActionType.USE_SKILL:
      return false;

    default:
      throw new Error(`Unknown action type ${BattleActionType[type]}`);
  }
};
