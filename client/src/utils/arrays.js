const anyOf = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const remove = (array, value, id = "id") => {
  const idx = array.findIndex((v) => v[id] === value[id]);
  return [...array.slice(0, idx), ...array.slice(idx + 1)];
};

export { anyOf, remove };
