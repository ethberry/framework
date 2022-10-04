export const getLotteryNumbers = (selected: Array<number>) => {
  const numbers: Array<boolean> = new Array(36).fill(false);
  selected.forEach(s => {
    numbers[s] = true;
  });
  return `{${numbers.join(",")}}`;
};
