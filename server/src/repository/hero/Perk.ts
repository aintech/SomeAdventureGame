import query from "../Db";
import { HeroWithItems, HeroWithPerks } from "./Hero";

export type Perk = {
  id: number;
  name: string;
  description: string;
};

export type HeroPerk = Perk & {
  heroId: number;
};

const _p: Perk[] = [];
export const getPerks = async () => {
  if (_p.length === 0) {
    const dbPerks = await query<Perk[]>("getPerks", "select * from public.perk", [], (row: PerkRow): Perk => {
      return { id: +row.id, name: row.name, description: row.description };
    });
    if (_p.length === 0) {
      _p.push(...dbPerks);
    }
  }
  return _p;
};

export const withPerks = async (heroes: HeroWithItems[]) => {
  if (heroes.length === 0) {
    return [];
  }
  const perks = await query<HeroPerk[]>(
    "withPerks",
    `select * from public.hero_perk hp
     left join public.perk p on p.id = hp.perk_id
     where hero_id in (${heroes.map((h) => h.id).join(",")})`,
    [],
    mapPerk
  );

  const heroWithPerks: HeroWithPerks[] = [];
  heroes.forEach((h) => heroWithPerks.push({ ...h, perks: perks.filter((p) => p.heroId === h.id) }));

  return heroWithPerks;
};

type PerkRow = {
  id: string;
  hero_id: string;
  name: string;
  description: string;
};

const mapPerk = (row: PerkRow): HeroPerk => {
  return {
    id: +row.id,
    heroId: +row.hero_id,
    name: row.name,
    description: row.description,
  };
};
