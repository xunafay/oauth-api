export function getEpoch(): number {
  return Math.floor(new Date().getTime() / 1000);
}
