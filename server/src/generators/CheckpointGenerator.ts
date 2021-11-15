import { HeroWithSkills } from "../repository/hero/Hero";
import { Drop, getAllMonsters, Monster } from "../repository/Monster";
import { Quest } from "../repository/quest/Quest";
import { CheckpointType, QuestCheckpoint } from "../repository/quest/QuestCheckpoints";
import { anyOf } from "../utils/Arrays";

export const generateCheckpoints = async (quest: Quest, embarkedHeroes: HeroWithSkills[]) => {
  const checkpoints: QuestCheckpoint[] = [];

  const checkpointsCount = 3; //Math.floor(quest.duration * 0.5 * 0.1);

  let checkpointsDuration = 0;

  for (let i = 0; i < checkpointsCount; i++) {
    const type = i % 2 == 0 ? CheckpointType.BATTLE : CheckpointType.TREASURE; //Math.random() > 1 ? "treasure" : "battle";

    const checkpointTime = i * 10;
    //пока чекпоинты начинаются с первой десятой части квеста
    const addSec = 5 + checkpointTime + checkpointsDuration;
    // Math.floor(quest.duration * 0.1) * 1000 + periodBetweenCheckpoints;
    // Math.floor(questDuration * 0.5) +
    // i * Math.floor(Math.random() * 10) * 1000;

    const occuredAt = addSec;

    let tribute: number;
    let enemies: Monster[] | undefined;
    switch (type) {
      case CheckpointType.TREASURE:
        tribute = quest.level * Math.floor(Math.random() * 20 + 10);
        break;
      case CheckpointType.BATTLE:
        enemies = await getMonsterParty(quest.level);
        tribute = quest.level * Math.floor(Math.random() * 5 + 50);
        break;
      default:
        throw new Error(`Unknown checkpoint type ${CheckpointType[type]}`);
    }

    checkpoints.push({
      type,
      occuredAt,
      enemies,
      tribute,
      passed: false,
    });
  }

  return checkpoints;
};

export const getMonsterParty = async (level: number) => {
  const monsters = await getAllMonsters();

  const partyCount = Math.floor(Math.random() * 3) + 2;
  //Пока в базе есть только монстры 1 уровня
  const monstersByLevel = [...monsters]; //_monsters.filter((m) => m.level === level);
  const suitable: Monster[] = [];
  for (let i = 0; i < partyCount; i++) {
    const monster: Monster = JSON.parse(JSON.stringify(anyOf(monstersByLevel)));
    monster.actorId = i;
    defineMonsterDrop(monster);
    suitable.push(monster);
  }

  return suitable;
};

const defineMonsterDrop = (monster: Monster) => {
  const drop: Drop[] = [];

  if (!monster.loot) {
    return drop;
  }

  const goldMediana = monster.loot.gold;
  const droppedGold = Math.floor(goldMediana + Math.random() * goldMediana * 0.25 * (Math.random() > 0.5 ? 1 : -1));
  for (let i = 0; i < droppedGold; i++) {
    const fraction = Math.floor((0.1 + Math.random() * 0.8) * monster.health);
    drop.push({ fraction, gold: 1 });
  }

  monster.drop = drop;
  monster.loot = undefined;
};
