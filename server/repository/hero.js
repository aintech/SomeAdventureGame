import { HEALTH_PER_VITALITY } from "../../client/src/utils/variables.js";
import query from "./db.js";

const selectQuery = `
     select *
     from public.hero h 
     left join public.hero_occupation o on o.hero_id = h.id`;

let _maxLevel = 0;
const _levels = [];
const _fetchLevels = () => {
  return query("fetchLevels", "select * from public.hero_level");
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
  if (heroes.length === 0) {
    return [];
  }
  return heroes
    .map((h) => {
      return { ...h, level: _calcHeroLevel(h) };
    })
    .map((h) => {
      return { ...h, progress: _calcLevelProgress(h) };
    });
};

const _addEquipment = async (heroes) => {
  if (heroes.length === 0) {
    return [];
  }
  const equipment = await query(
    "addEquipment",
    `select * from public.hero_equipment he
     left join public.equipment e on e.id = he.equipment_id
     where he.hero_id in (${heroes.map((h) => h.id).join(",")})`
  );

  heroes.forEach((h) => {
    h.equipment = equipment.filter((e) => e.hero_id === h.id);
  });

  return heroes;
};

const _prepareHeroes = (heroes) => {
  return _addEquipment(_addLevelInfo(heroes));
};

/**
 * У атрибутов (power, health и т.д.) значения указаны уже с учётом экипировки!
 * так сделано чтобы не подмешивать в разных местах характеристики экипировки при расчёте
 * характеристик героя.
 */
const getHeroes = async (userId) => {
  await _checkLevelsLoaded();
  return query(
    "getHeroes",
    `${selectQuery} where user_id = $1 and hired = true`,
    [userId],
    _prepareHeroes
  );
};

const getNotHiredHeroes = async (userId) => {
  await _checkLevelsLoaded();
  return query(
    "getNotHiredHeroes",
    `${selectQuery} where user_id = $1 and hired = false`,
    [userId],
    _prepareHeroes
  );
};

const hireHero = async (userId, heroId) => {
  await query(
    "hireHero - stats",
    `update public.stats 
     set gold = gold - (select gold from public.hero where id = $2)
     where user_id = $1`,
    [userId, heroId]
  );

  await query(
    "hireHero - hired",
    `update public.hero set hired = true where id = $1`,
    [heroId]
  );

  await query(
    "hireHero - occupation",
    `insert into public.hero_occupation (hero_id) values ($1)`,
    [heroId]
  );

  return getHeroesByIds([heroId]);
};

const getHeroesByIds = async (heroIds) => {
  await _checkLevelsLoaded();
  return query(
    "getHeroesByIds",
    `${selectQuery} where id in (${heroIds.join(",")})`,
    [],
    _prepareHeroes
  );
};

const embarkHeroesOnQuest = (questId, heroIds) => {
  return query(
    "embarkHeroesOnQuest",
    `update public.hero set embarked_quest = $1 
     where id in (${heroIds.join(",")})`,
    [questId]
  );
};

const adjustHealth = (heroId, amount) => {
  return query(
    "adjustHealth",
    `update public.hero 
     set health = greatest(0, least(vitality * ${HEALTH_PER_VITALITY}, health + ${amount})) 
     where id = $1`,
    [heroId]
  );
};

const getHeroesOnQuest = (userId, questId) => {
  return query(
    "getHeroesOnQuest",
    `${selectQuery} where user_id = $1 and embarked_quest = $2`,
    [userId, questId],
    _prepareHeroes
  );
};

const completeHeroesQuest = async (heroIds, heroesTribute, experience) => {
  const tributePerHero = Math.floor(heroesTribute / heroIds.length);
  const experiencePerHero = Math.floor(experience / heroIds.length);

  return query(
    "completeHeroesQuest",
    `update public.hero
     set gold = (gold + $1), experience = (experience + $2), embarked_quest = null
     where id in (${heroIds.join(",")})`,
    [tributePerHero, experiencePerHero]
  );
};

export {
  getHeroes,
  getNotHiredHeroes,
  hireHero,
  getHeroesByIds,
  embarkHeroesOnQuest,
  adjustHealth,
  getHeroesOnQuest,
  completeHeroesQuest,
};
