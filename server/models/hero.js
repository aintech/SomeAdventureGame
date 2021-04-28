import usePool from "./use-pool.js";

const getHeroes = (userId) => {
  return new Promise((resolve, reject) => {
    usePool(
      "select * from public.hero where user_id = $1",
      [userId],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.rows);
      }
    );
  });
};

const getHeroesByIds = (heroIds) => {
  return new Promise((resolve, reject) => {
    usePool(
      `select * from public.hero where id in (${heroIds.join(",")})`,
      [],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.rows);
      }
    );
  });
};

const embarkHeroesOnQuest = (questId, heroIds) => {
  return new Promise((resolve, reject) => {
    usePool(
      `update public.hero set embarked_quest = $1 
       where id in (${heroIds.join(",")})`,
      [questId],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({});
      }
    );
  });
};

const completeHeroesQuest = async (heroIds, heroesTribute, experience) => {
  const tributePerHero = Math.floor(heroesTribute / heroIds.length);
  const experiencePerHero = Math.floor(experience / heroIds.length);

  return new Promise((resolve, reject) => {
    usePool(
      `update public.hero
       set gold = (gold + $1), experience = (experience + $2), embarked_quest = null
       where id in (${heroIds.join(",")})`,
      [tributePerHero, experiencePerHero],
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve({});
      }
    );
  });
};

export { getHeroes, getHeroesByIds, embarkHeroesOnQuest, completeHeroesQuest };
