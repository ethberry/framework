import { snakeToCamelCase } from "@gemunion/utils";

export const getNumbers = (selected = [0, 1, 2, 3, 5, 8]) => {
  const numbers: Array<boolean> = new Array(36).fill(false);
  selected.forEach(s => {
    numbers[s] = true;
  });
  return numbers;
};

export const getContractName = (base: string, network: string) => {
  return base.endsWith("Random") || base.endsWith("Genes") ? snakeToCamelCase(`${base}_${network}`) : base;
};
