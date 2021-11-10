import Hero, { maxHealth } from "../../../../../models/hero/Hero";
import { ItemSubtype } from "../../../../../models/Item";
import { HeroReactionType } from "../../QuestPerform";
import CheckpointActor from "../process-helpers/CheckpointActor";
import { HeroEvent } from "./BattleProcess";

export const battleRound = (seconds: number, heroes: Hero[], enemies: CheckpointActor[], battleEvents: Map<number, HeroEvent[]>) => {
  const events: Map<number, HeroEvent[]> = new Map(battleEvents);
  const reactions: Map<number, Map<HeroReactionType, number>> = new Map();

  enemies
    .filter((enemy) => enemy.currentHealth > 0)
    .forEach((enemy) => {
      if (seconds % enemy.stats.initiative === 0) {
        const aliveHeroes = heroes.filter((h) => h.health > 0);
        if (aliveHeroes.length > 0) {
          const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
          if (enemy.stats.power > target.stats.defence + target.equipStats.defence) {
            let damage = enemy.stats.power - target.stats.defence - target.equipStats.defence;
            if (damage > target.health) {
              damage = target.health;
            }

            addHeroReaction(reactions, target, HeroReactionType.HITTED, -damage);

            const event = { time: new Date().getTime(), hpAlter: -damage };
            if (events.has(target.id)) {
              events.get(target.id)!.push(event);
            } else {
              events.set(target.id, [event]);
            }
          }
        }
      }
    });

  heroes.forEach((hero) => {
    const currHealth = hero.health + (reactions.get(hero.id)?.get(HeroReactionType.HITTED) ?? 0);
    const totalHealth = maxHealth(hero);

    if (currHealth > 0 && currHealth / totalHealth < 0.3) {
      const potion = pickHealthPotion(hero);

      if (potion) {
        let healAmount = 0;

        switch (potion.subtype) {
          case ItemSubtype.HEALTH_ELIXIR:
            healAmount = totalHealth - currHealth;
            break;
          case ItemSubtype.HEALTH_POTION:
            healAmount = maxHealth(hero) * 0.5;
            if (healAmount + currHealth > totalHealth) {
              healAmount = totalHealth - currHealth;
            }
            break;
          default:
            throw new Error(`Unknown potion type ${ItemSubtype[potion.subtype]}`);
        }

        addHeroReaction(reactions, hero, HeroReactionType.HEALED, healAmount);

        const event = { time: new Date().getTime(), itemId: potion.id, hpAlter: healAmount };
        if (events.has(hero.id)) {
          events.get(hero.id)!.push(event);
        } else {
          events.set(hero.id, [event]);
        }
      }
    }
  });

  return { events, reactions };
};

const pickHealthPotion = (hero: Hero) => {
  if (hero.items.length === 0) {
    return;
  }

  let potions = hero.items.filter((i) => i.subtype === ItemSubtype.HEALTH_POTION && i.amount > 0);
  let potion = potions.length === 0 ? undefined : potions[0];

  if (!potion) {
    potions = hero.items.filter((i) => i.subtype === ItemSubtype.HEALTH_ELIXIR && i.amount > 0);
    potion = potions.length === 0 ? undefined : potions[0];
  }

  if (potion) {
    potion.amount--;
  }

  return potion;
};

const addHeroReaction = (reactions: Map<number, Map<HeroReactionType, number>>, hero: Hero, type: HeroReactionType, amount: number) => {
  if (reactions.has(hero.id)) {
    if (reactions.get(hero.id)!.has(type)) {
      const existed = reactions.get(hero.id)!.get(type)!;
      reactions.get(hero.id)!.set(type, existed + amount);
    } else {
      reactions.get(hero.id)!.set(type, amount);
    }
  } else {
    const reaction: Map<HeroReactionType, number> = new Map();
    reaction.set(type, amount);
    reactions.set(hero.id, reaction);
  }
};
