export const getNumbers = (selected = [0, 1, 2, 3, 5, 8, 13]) => {
  const numbers: Array<boolean> = new Array(40).fill(false);
  selected.forEach(s => {
    numbers[s] = true;
  });
  return numbers;
};
