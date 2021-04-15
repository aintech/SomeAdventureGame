export default class ApiService {
  data = [
    {
      id: 1,
      type: "tavern",
      position: { x: 587, y: 237 },
    },
    {
      id: 2,
      type: "guild",
      position: { x: 656, y: 156 },
    },
  ];

  getBuildings() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.data);
      }, 100);
    });
  }
}
