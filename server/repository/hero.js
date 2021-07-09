import { HEALTH_PER_VITALITY } from "../../client/src/utils/variables.js";
import query from "./db.js";
import { updateHeroActivities } from "./hero-activity.js";

const selectQuery = `
     select *
     from public.hero h 
     left join public.hero_activity a on a.hero_id = h.id`;

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
  const prevLvlExp = _levels.filter((l) => l.lvl === hero.level)[0];
  if (!prevLvlExp) {
    console.log(hero);
  }
  const nextLvlExp =
    hero.level === _maxLevel
      ? Number.MAX_SAFE_INTEGER
      : _levels.filter((l) => l.lvl === hero.level + 1)[0].exp;

  const lvlsScope = nextLvlExp - prevLvlExp.exp;
  const heroScope = hero.experience - prevLvlExp.exp;
  return heroScope / lvlsScope;
};

const _addLevelInfo = async (heroes) => {
  await _checkLevelsLoaded();
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
  await _checkLevelsLoaded();
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

const _addItems = async (heroes) => {
  if (heroes.length === 0) {
    return [];
  }
  const items = await query(
    "addItems",
    `select * from public.hero_item 
     where hero_id in (${heroes.map((h) => h.id).join(",")})`
  );

  heroes.forEach((h) => (h.items = items.filter((i) => i.hero_id === h.id)));

  return heroes;
};

const _prepareHeroes = async (heroes) => {
  return _addItems(await _addEquipment(await _addLevelInfo(heroes)));
};

/**
 * У атрибутов (power, health и т.д.) значения указаны уже с учётом экипировки!
 * так сделано чтобы не подмешивать в разных местах характеристики экипировки при расчёте
 * характеристик героя.
 */
const getHeroes = async (userId) => {
  return query(
    "getHeroes",
    `${selectQuery} where user_id = $1 and hired = true`,
    [userId],
    _prepareHeroes
  );
};

const getHeroesByIds = async (heroIds) => {
  return query(
    "getHeroesByIds",
    `${selectQuery} where id in (${heroIds.join(",")})`,
    [],
    _prepareHeroes
  );
};

const getNotHiredHeroes = async (userId) => {
  return query(
    "getNotHiredHeroes",
    `${selectQuery} where user_id = $1 and hired = false`,
    [userId],
    _prepareHeroes
  );
};

const hireHero = async (userId, heroId) => {
  await Promise.all([
    query(
      "hireHero - stats",
      `update public.stats 
       set gold = gold - (select gold from public.hero where id = $2)
       where user_id = $1`,
      [userId, heroId]
    ),
    query(
      "hireHero - hired",
      `update public.hero set hired = true where id = $1`,
      [heroId]
    ),
    query(
      "hireHero - activity",
      `insert into public.hero_activity (hero_id) values ($1)`,
      [heroId]
    ),
  ]);

  return getHeroesByIds([heroId]);
};

const dismissHero = async (heroId) => {
  await query(
    "dismissHero - equipment",
    `delete from public.hero_equipment where hero_id = $1`,
    [heroId]
  );

  await query(
    "dismissHero - activity",
    `delete from public.hero_activity where hero_id = $1`,
    [heroId]
  );

  await query("dismissHero - hero", `delete from public.hero where id = $1`, [
    heroId,
  ]);
};

const setHeroHealth = (heroId, amount) => {
  return query(
    "adjustHeroHealth",
    `update public.hero 
     set health = $2
     where id = $1`,
    [heroId, amount]
  );
};

const adjustHeroHealth = (heroId, amount) => {
  return query(
    "adjustHeroHealth",
    `update public.hero 
     set health = greatest(0, least(health + $2, vitality * $3)) 
     where id = $1`,
    [heroId, amount, HEALTH_PER_VITALITY]
  );
};

const adjustHeroGold = (heroId, amount) => {
  return query(
    "adjustGold",
    `update public.hero set gold = (gold + $2) where id = $1`,
    [heroId, amount]
  );
};

const getHeroesOnQuest = (userId, questId) => {
  return query(
    "getHeroesOnQuest",
    `${selectQuery} where user_id = $1 and a.activity_id = $2`,
    [userId, questId],
    _prepareHeroes
  );
};

const completeHeroesQuest = async (
  userId,
  heroIds,
  heroesTribute,
  experience
) => {
  const tributePerHero = Math.floor(heroesTribute / heroIds.length);
  const experiencePerHero = Math.floor(experience / heroIds.length);

  await query(
    "completeHeroesQuest",
    `update public.hero
     set gold = (gold + $1), experience = (experience + $2)
     where id in (${heroIds.join(",")})`,
    [tributePerHero, experiencePerHero]
  );

  await updateHeroActivities(
    userId,
    heroIds.map((id) => {
      return {
        heroId: id,
        type: "idle",
      };
    })
  );
};

export {
  getHeroes,
  getHeroesByIds,
  getNotHiredHeroes,
  hireHero,
  dismissHero,
  setHeroHealth,
  adjustHeroHealth,
  adjustHeroGold,
  getHeroesOnQuest,
  completeHeroesQuest,
};
