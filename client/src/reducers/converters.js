/**
 *
 * Вычитаем бонус экипировки чтобы получить "начальное" значение атрибута героя
 */
const getRawAttribute = (hero, attrName) => {
  return (
    +hero[attrName] -
    hero.equipment.map((e) => +e[attrName]).reduce((a, b) => a + b)
  );
};

const convertQuestCheckpoint = (checkpoint) => {
  return {
    id: checkpoint.id,
    occuredTime: +checkpoint.occured_time,
    type: checkpoint.type,
    duration: +checkpoint.duration,
    outcome:
      checkpoint.type === "treasure"
        ? checkpoint.outcome
        : new Map(JSON.parse(checkpoint.outcome)),
    actors: checkpoint.actors ? new Map(JSON.parse(checkpoint.actors)) : null,
  };
};

const convertHero = (hero) => {
  return {
    id: hero.id,
    name: hero.name,
    type: hero.type,
    level: hero.level,
    health: hero.health,
    power: hero.power,
    powerRaw: getRawAttribute(hero, "power"),
    defence: hero.defence,
    defenceRaw: getRawAttribute(hero, "defence"),
    vitality: hero.vitality,
    vitalityRaw: getRawAttribute(hero, "vitality"),
    initiative: hero.initiative,
    initiativeRaw: getRawAttribute(hero, "initiative"),
    experience: hero.experience,
    gold: hero.gold,
    embarkedQuest: hero.embarked_quest,
    progress: hero.progress,
    equipment: hero.equipment,
  };
};

const convertQuest = (quest) => {
  return {
    id: quest.id,
    level: quest.level,
    title: quest.title,
    description: quest.description,
    experience: quest.experience,
    duration: quest.duration,
    progressId: quest.progress_id,
    progressDuration: quest.progress_duration,
    tribute: quest.tribute,
    fame: quest.fame,
    embarkedTime: quest.embarked_time ? Date.parse(quest.embarked_time) : null,
    checkpoints: quest.checkpoints.map((c) => convertQuestCheckpoint(c)),
  };
};

export { convertHero, convertQuest };
