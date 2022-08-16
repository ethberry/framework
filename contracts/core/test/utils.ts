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
      return `${base}Hardhat`;
    case "besu":
      return `${base}Besu`;
    default:
      return base;
  }
};
