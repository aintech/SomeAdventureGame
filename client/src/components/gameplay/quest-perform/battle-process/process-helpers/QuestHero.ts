import Hero from '../../../../../models/hero/Hero';
import { StatusEffect } from './CheckpointActor';

export enum HeroAction {
  ATTACK,
  DEFENCE,
  USE_SKILL,
  USE_ITEM,
}

export default class QuestHero extends Hero {
  public action: HeroAction = HeroAction.ATTACK;
  public statusEffects: StatusEffect[] = [];
  public hitted?: boolean;
  public healed?: boolean;
}
