const getTotalAttribute = (hero, attrName) => {
  return (
    +hero[attrName] +
    hero.equipment.map((e) => +e[attrName]).reduce((a, b) => a + b)
  );
};

const convertQuestCheckpoint = (checkpoint) => {
  return {
    id: checkpoint.id,
    occuredTime: +checkpoint.occured_time,
    type: checkpoint.type,
    duration: +checkpoint.duration,
    outcome: checkpoint.outcome,
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
    powerTotal: getTotalAttribute(hero, "power"),
    defence: hero.defence,
    defenceTotal: getTotalAttribute(hero, "defence"),
    vitality: hero.vitality,
    vitalityTotal: getTotalAttribute(hero, "vitality"),
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
