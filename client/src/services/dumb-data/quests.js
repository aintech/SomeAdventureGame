const quests = [
  {
    id: 1,
    level: 3,
    title: "Охота на ведьмочек",
    description:
      "Три миловидные ведьмы проводят в нашем сарае свои глупые ритуалы, а как нам картоху копать без лопат? Мешочек на :tribute монет ждёт героев.",
    duration: 10,
    fame: 30,
    tribute: 200,
    experience: 300,
    embarkedTime: null,
  },
  {
    id: 2,
    level: 2,
    title: "Гоблинский шабаш",
    description:
      "Орава гоблинов совсем распоясалась, нормальным людям спать не даёт, гоните их в шею, а с меня :tribute монет.",
    duration: 10,
    fame: 20,
    tribute: 350,
    experience: 200,
    embarkedTime: null,
  },
  {
    id: 3,
    level: 1,
    title: "Бить и пить",
    description:
      "Дам бочку отличного пива и мешочек со :tribute монетами тому кто прогонит с моей винодельни проклятых гарпий.",
    duration: 10,
    fame: 10,
    tribute: 150,
    experience: 100,
    embarkedTime: null,
  },
  {
    id: 4,
    level: 5,
    title: "Хочу рыбачить",
    description:
      "Прибейте кто-нибудь этих утопцев наконец, воду мутят, рыбу жрут, рыбачить невозможно. Готов отдать :tribute монет тому кто избавится от негодных.",
    duration: 10,
    fame: 50,
    tribute: 570,
    experience: 500,
    embarkedTime: null,
  },
  {
    id: 5,
    level: 10,
    title: "Голем",
    description:
      "Я - Великий хранитель тайн и запретных знаний Астох создал невероятное создание - настоящего мышиного Голема. Так теперь эта сволочь сидит в подвале и пожирает мои харчи. Удавите его поскорее и вынесите куда-нибудь в лес. Сокровища в :tribute монет ждут смельчаков.",
    duration: 10,
    fame: 100,
    tribute: 890,
    experience: 1000,
    embarkedTime: null,
  },
  {
    id: 6,
    level: 5,
    title: "Ради науки",
    description:
      "Мне нужны помет летучих мышей Кролоса один пуд, хвосты игуан Гарула штук 10 и ещё 12 голов кусь-рыбы с Тароса. Знание алхимии приветствуется (те кто не знает где у кусь-рыбы хвост а где башка даже не приходите). Даю :tribute монет.",
    duration: 22,
    fame: 50,
    tribute: 1050,
    experience: 500,
    embarkedTime: new Date() - 20000,
  },
];

export default quests;
