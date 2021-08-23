import generateBattleRounds, { BattleRound } from "./BattleGenerator";
import { HeroWithSkills } from "../repository/hero/Hero";
import { getAllMonsters, Monster } from "../repository/Monster";
import { Quest } from "../repository/quest/Quest";
import { CheckpointType, QuestCheckpoint } from "../repository/quest/QuestCheckpoints";
import { anyOf } from "../utils/Arrays";

export const generateCheckpoints = async (quest: Quest, heroes: HeroWithSkills[]) => {
  const checkpoints: QuestCheckpoint[] = [];

  const checkpointsCount = 1; //Math.floor(quest.duration * 0.5 * 0.1);

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
    let duration: number;
    let rounds: Map<number, BattleRound[]> | undefined;
    let enemies: Monster[] | undefined;
    switch (type) {
      case CheckpointType.TREASURE:
        tribute = quest.level * Math.floor(Math.random() * 20 + 10);
        duration = 10;
        break;
      case CheckpointType.BATTLE:
        const monsters = await getMonsterParty(quest.level);
        rounds = generateBattleRounds(monsters, heroes);
        tribute = quest.level * Math.floor(Math.random() * 5 + 5);
        enemies = [...monsters];
        duration = Math.max(...Array.from(rounds.keys()));
        break;
      default:
        throw new Error(`Unknown checkpoint type ${CheckpointType[type]}`);
    }

    checkpointsDuration += duration;

    checkpoints.push({
      type,
      occuredAt,
      duration,
      rounds,
      enemies,
      tribute,
      passed: false,
    });
  }

  return checkpoints;
};

export const getMonsterParty = async (level: number) => {
  const monsters = await getAllMonsters();

  const partyCount = 1; // Math.random() > 0.5 ? 2 : 3; // Math.floor(Math.random() * 3) + 1;
  //Пока в базе есть только монстры 1 уровня
  const monstersByLevel = [...monsters]; //_monsters.filter((m) => m.level === level);
  const suitable: Monster[] = [];
  for (let i = 0; i < partyCount; i++) {
    const monster: Monster = JSON.parse(JSON.stringify(anyOf(monstersByLevel)));
    monster.actorId = i;
    suitable.push(monster);
  }

  return suitable;
};
