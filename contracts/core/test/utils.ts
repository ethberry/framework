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

export const isEqualArray = (...args: any[]): any => {
  return (eventValues: any[]): boolean => {
    for (let i = 0; i < eventValues.length; i++) {
      if (JSON.stringify(eventValues[i]) !== JSON.stringify(args[i])) {
        console.error("eventValues[i]", JSON.stringify(eventValues[i]));
        console.error("args[i]", JSON.stringify(args[i]));
        return false;
      }
    }
    return true;
  };
};
