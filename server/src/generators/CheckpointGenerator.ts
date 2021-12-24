import { HeroWithSkills } from '../repository/hero/Hero';
import { getAllMonsters, Monster } from '../repository/Monster';
import { Quest } from '../repository/quest/Quest';
import { CheckpointType, QuestCheckpoint } from '../repository/quest/QuestCheckpoints';
import { anyOf } from '../utils/Arrays';

export const generateCheckpoints = async (quest: Quest, embarkedHeroes: HeroWithSkills[]) => {
  const checkpoints: QuestCheckpoint[] = [];

  const checkpointsCount = 3; //Math.floor(quest.duration * 0.5 * 0.1);

  for (let i = 0; i < checkpointsCount; i++) {
    const type: number = CheckpointType.BATTLE; // i % 2 == 0 ? CheckpointType.BATTLE : CheckpointType.TREASURE; //Math.random() > 1 ? "treasure" : "battle";

    //пока чекпоинты начинаются с первой десятой части квеста
    // Math.floor(quest.duration * 0.1) * 1000 + periodBetweenCheckpoints;
    // Math.floor(questDuration * 0.5) +
    // i * Math.floor(Math.random() * 10) * 1000;

    let treasure = 0;
    let enemies: Monster[] = [];
    switch (type) {
      case CheckpointType.BATTLE:
        enemies = await getMonsterParty(quest.level);
        break;
      case CheckpointType.TREASURE:
        treasure = quest.level * Math.floor(Math.random() * 20 + 10);
        break;
      default:
        throw new Error(`Unknown checkpoint type ${CheckpointType[type]}`);
    }

    checkpoints.push({
      type,
      occuredAt: i + 1,
      treasure,
      enemies,
      passed: false,
    });
  }

  return checkpoints;
};

export const getMonsterParty = async (level: number) => {
  const monsters = await getAllMonsters();

  const partyCount = 1; // Math.floor(Math.random() * 3) + 2;
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
