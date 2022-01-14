export enum BattleAction {
  ATTACK,
  DEFENCE,
  CHOOSING_SKILL_ITEM,
  USE_ITEM,
  USE_SKILL,
}

/**
 * Активное действие подразумевает что при его выборе переключается следующий раунд.
 */
export const isActive = (action: BattleAction) => {
  switch (action) {
    case BattleAction.DEFENCE:
      return true;

    case BattleAction.ATTACK:
    case BattleAction.CHOOSING_SKILL_ITEM:
      return false;

    default:
      throw new Error(`Unknown action type ${BattleAction[action]}`);
  }
};
