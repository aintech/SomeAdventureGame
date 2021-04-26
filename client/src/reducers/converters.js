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

export { convertHero };
