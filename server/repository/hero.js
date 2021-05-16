import usePool from "./use-pool.js";

let _maxLevel = 0;
const _levels = [];
const _fetchLevels = () => {
  return new Promise((resolve, reject) => {
    usePool("select * from public.hero_level", [], (_, result) => {
      resolve(result.rows);
    });
  });
};

/**
 * TODO: Переделать на декоратор при переезде на TypeScript
 */
const _checkLevelsLoaded = async () => {
  if (_levels.length === 0) {
    await _fetchLevels().then((data) =>
      data.forEach((d) =>
        _levels.push({ lvl: Number(d.level), exp: Number(d.experience) })
      )
    );
    _maxLevel = Math.max(..._levels.map((l) => l.lvl));
  }
};

const _calcHeroLevel = (hero) => {
  return Math.max(
    ..._levels.filter((l) => l.exp < hero.experience).map((l) => l.lvl)
  );
};

const _calcLevelProgress = (hero) => {
  const prevLvlExp = _levels.filter((l) => l.lvl === hero.level)[0].exp;
  const nextLvlExp =
    hero.level === _maxLevel
      ? Number.MAX_SAFE_INTEGER
      : _levels.filter((l) => l.lvl === hero.level + 1)[0].exp;

  const lvlsScope = nextLvlExp - prevLvlExp;
  const heroScope = hero.experience - prevLvlExp;
  return heroScope / lvlsScope;
};

const _addLevelInfo = (heroes) => {
  return heroes
    .map((h) => {
      return { ...h, level: _calcHeroLevel(h) };
    })
    .map((h) => {
      return { ...h, progress: _calcLevelProgress(h) };
    });
};

const _addEquipment = async (heroes) => {
  const equipment = await new Promise((resolve, reject) => {
    usePool(
      `select * from public.hero_equipment he
       left join public.equipment e on e.id = he.equipment_id
       where he.hero_id in (${heroes.map((h) => h.id).join(",")})`,
      [],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.rows);
      }
    );
  });

  heroes.forEach((h) => {
    h.equipment = equipment.filter((e) => e.hero_id === h.id);
  });

  return heroes;
};

const _prepareHeroes = (heroes) => {
  return _addEquipment(_addLevelInfo(heroes));
};

const getHeroes = async (userId) => {
  await _checkLevelsLoaded();

  return new Promise((resolve, reject) => {
    usePool(
      "select * from public.hero where user_id = $1",
      [userId],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(_prepareHeroes(result.rows));
      }
    );
  });
};

const getHeroesByIds = async (heroIds) => {
  await _checkLevelsLoaded();

  return new Promise((resolve, reject) => {
    usePool(
      `select * from public.hero where id in (${heroIds.join(",")})`,
      [],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(_prepareHeroes(result.rows));
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
      (error, _) => {
        if (error) {
          return reject(new Error(`embarkHeroesOnQuest ${error}`));
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
          return reject(new Error(`completeHeroesQuest ${error}`));
        }
        resolve({});
      }
    );
  });
};

export { getHeroes, getHeroesByIds, embarkHeroesOnQuest, completeHeroesQuest };
