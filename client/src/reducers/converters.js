const convertHero = (hero) => {
  return {
    id: hero.id,
    name: hero.name,
    type: hero.type,
    level: hero.level,
    health: hero.health,
    power: hero.power,
    experience: hero.experience,
    gold: hero.gold,
    embarkedQuest: hero.embarked_quest,
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
    tribute: quest.tribute,
    fame: quest.fame,
    embarkedTime: quest.embarked_time ? Date.parse(quest.embarked_time) : null,
  };
};

export { convertHero, convertQuest };
