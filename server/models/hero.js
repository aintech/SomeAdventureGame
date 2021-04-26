import usePool from "./use-pool.js";

class Hero {
  constructor(id, userId, name, type, level, health, power, experience, gold) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.type = type;
    this.level = level;
    this.health = health;
    this.power = power;
    this.experience = experience;
    this.gold = gold;
  }
}

const getUserHeroes = (userId) => {
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

export { getUserHeroes };
