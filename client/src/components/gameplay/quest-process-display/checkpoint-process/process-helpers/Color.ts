type Color = {
  r: number; //0...255
  g: number; //0...255
  b: number; //0...255
  a: number; //0...1
};

export const create = (r: number = 0, g: number = 0, b: number = 0, a: number = 1): Color => {
  return { r, g, b, a };
};

export const stringify = (color: Color | string) => {
  return typeof color === "string" ? color : `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
};

export default Color;
