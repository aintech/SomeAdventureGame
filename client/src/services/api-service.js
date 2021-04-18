export default class ApiService {
  buildings = [
    {
      id: 1,
      type: "tavern",
    },
    {
      id: 2,
      type: "guild",
    },
  ];

  quests = [
    {
      id: 1,
      level: 3,
      title: "Охота на ведьмочек",
      description:
        "Три миловидные ведьмы проводят в нашем сарае свои глупые ритуалы, а как нам картоху копать без лопат?",
      duration: 120,
      tribute: 200,
    },
    {
      id: 2,
      level: 2,
      title: "Гоблинский шабаш",
      description:
        "Орава гоблинов совсем распоясалась, нормальным людям спать не даёт, гоните их в шею.",
      duration: 150,
      tribute: 350,
    },
    {
      id: 3,
      level: 1,
      title: "Бить и пить",
      description:
        "Дам бочку отличного пива и мешочек монет тому кто прогонит с моей винодельни проклятых гарпий.",
      duration: 80,
      tribute: 150,
    },
    {
      id: 4,
      level: 5,
      title: "Хочу рыбачить",
      description:
        "Прибейте кто-нибудь этих утопцев наконец, воду мутят, рыбу жрут, рыбачить невозможно.",
      duration: 250,
      tribute: 570,
    },
    {
      id: 7,
      level: 10,
      title: "Голем",
      description:
        "Я - Великий хранитель тайн и запретных знаний Астох создал невероятное создание - настоящего мышиного Голема. Так теперь эта сволочь сидит в подвале и пожирает мои харчи. Удавите его поскорее и вынесите куда-нибудь в лес.",
      duration: 320,
      tribute: 890,
    },
    {
      id: 6,
      level: 5,
      title: "Ради науки",
      description:
        "Мне нужны помет летучих мышей Кролоса один пуд, хвосты игуан Гарула штук 10 и ещё 12 голов кусь-рыбы с Тароса. Знание алхимии приветствуется (те кто не знает где у кусь-рыбы хвост а где башка даже не приходите).",
      duration: 850,
      tribute: 1050,
    },
  ];

  heroes = [
    {
      id: 1,
      name: "Jonh",
      class: "warrior",
      level: 3,
      health: 20,
      power: 7,
      embarkedOnQuest: null,
    },
    {
      id: 2,
      name: "Steven",
      class: "wizard",
      level: 1,
      health: 5,
      power: 3,
      embarkedOnQuest: null,
    },
    {
      id: 3,
      name: "Flora",
      class: "wizard",
      level: 5,
      health: 25,
      power: 14,
      embarkedOnQuest: null,
    },
    {
      id: 4,
      name: "Ratta de curra",
      class: "warrior",
      level: 17,
      health: 95,
      power: 45,
      embarkedOnQuest: null,
    },
    {
      id: 5,
      name: "Currier",
      class: "warrior",
      level: 1,
      health: 10,
      power: 3,
      embarkedOnQuest: 999,
    },
  ];

  getBuildings() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.buildings);
      }, 100);
    });
  }

  getQuests() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.quests);
      }, 100);
    });
  }

  getHeroes() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.heroes);
      }, 100);
    });
  }
}
