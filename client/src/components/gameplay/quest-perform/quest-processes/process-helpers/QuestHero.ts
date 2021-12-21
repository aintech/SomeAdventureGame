import Hero from '../../../../../models/hero/Hero';

export enum BattleAction {
  ATTACK,
  DEFEND,
}

export default class QuestHero extends Hero {
  public action: BattleAction = BattleAction.ATTACK;
  public hitted?: boolean;
  public healed?: boolean;
}
