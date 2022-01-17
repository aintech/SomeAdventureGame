import Hero from '../../../../models/hero/Hero';
import { BattleAction, BattleActionType } from './BattleAction';
import { StatusEffect } from './StatusEffect';

export default class QuestHero extends Hero {
  public action: BattleAction = { type: BattleActionType.ATTACK };
  public statusEffects: StatusEffect[] = [];
  public hitted?: boolean;
  public healed?: boolean;
}
