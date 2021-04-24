import buildings from "./dumb-data/buildings.js";
import heroes from "./dumb-data/heroes.js";
import quests from "./dumb-data/quests.js";

export default class ApiService {
  constructor() {
    this.gameStats = {
      gold: 100,
      fame: 30,
    };
  }

  getGameStats() {
    return new Promise((resolve) => {
      const { gold, fame } = this.gameStats;
      setTimeout(() => {
        resolve({ gold, fame });
      }, 100);
    });
  }

  getBuildings() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(buildings);
      }, 100);
    });
  }

  getQuests() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(quests);
      }, 100);
    });
  }

  getHeroes() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(heroes);
      }, 100);
    });
  }

  getEmbarkedQuests() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = [];
        const embarkedQuests = quests.filter((q) => q.embarkedTime);
        const embarkedHeroes = heroes.filter((h) => h.embarkedQuest);

        for (let i = 0; i < embarkedQuests.length; i++) {
          result.push({
            key: embarkedQuests[i],
            value: embarkedHeroes.filter(
              (h) => h.embarkedQuest === embarkedQuests[i].id
            ),
          });
        }
        resolve(result);
      }, 100);
    });
  }

  embarkHeroesOnQuest(payload) {
    const { quest, heroesAssignedToQuest } = payload;
    return new Promise((resolve) => {
      quest.embarkedTime = new Date();

      heroesAssignedToQuest.forEach((hero) => {
        hero.embarkedQuest = quest.id;
      });

      setTimeout(() => {
        resolve({ quest, heroesAssignedToQuest });
      }, 100);
    });
  }

  questRewardCollected(payload) {
    const { quest } = payload;
    const hrs = payload.heroes;

    return new Promise((resolve) => {
      const heroGold = Math.floor(Math.floor(quest.tribute * 0.5) / hrs.length);
      const heroExperience = Math.floor(quest.heroExperience / hrs.length);

      const idx = quests.findIndex((q) => q.id === quest.id);
      quests.splice(idx, 1);
      const ids = hrs.map((h) => h.id);
      heroes.forEach((h) => {
        if (ids.includes(h.id)) {
          h.embarkedQuest = null;
          h.gold += heroGold;
          h.experience += heroExperience;
        }
      });

      this.gameStats.gold += Math.floor(quest.tribute * 0.5);
      this.gameStats.fame += quest.fame;

      resolve({
        gold: this.gameStats.gold,
        fame: this.gameStats.fame,
        questId: quest.id,
      });
    });
  }
}
