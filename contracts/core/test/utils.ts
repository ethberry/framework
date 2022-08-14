export const getNumbers = (selected = [0, 1, 2, 3, 5, 8]) => {
  const numbers: Array<boolean> = new Array(36).fill(false);
  selected.forEach(s => {
    numbers[s] = true;
  });
  return numbers;
};

export const getContractName = (base: string, network: string) => {
  switch (network) {
    case "hardhat":
      return `${base}TestHardhat`;
    case "besu":
      return `${base}TestBesu`;
    default:
      return base;
  }
};
