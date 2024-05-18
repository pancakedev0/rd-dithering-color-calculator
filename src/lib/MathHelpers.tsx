export function randomInt(min: number, max: number) {
  const random = Math.random();

  const rescaled = random * (max - min);
  const moved = rescaled + min;

  return Math.floor(moved);
}
