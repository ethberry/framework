import { snakeToCamelCase } from "@gemunion/utils";

// Patch BigNumber
// https://github.com/GoogleChromeLabs/jsbi/issues/30
// eslint-disable-next-line no-extend-native
Object.defineProperty(BigInt.prototype, "toJSON", {
  value: function () {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.toString();
  },
  configurable: true,
  enumerable: false,
  writable: true,
});

export const getNumbers = (selected = [0, 1, 2, 3, 5, 8]) => {
  const numbers: Array<boolean> = new Array(Number(36)).fill(false);
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

export const isEqualEventArgObj = (args: any): any => {
  return (eventValues: any): boolean => {
    for (const key of Object.keys(args)) {
      if (JSON.stringify(eventValues[key]) !== JSON.stringify(args[key])) {
        console.error(`eventValues[${key}]`, JSON.stringify(eventValues[key]));
        console.error(`args[${key}]`, JSON.stringify(args[key]));
        return false;
      }
    }
    return true;
  };
};

export const isEqualEventArgArrObj = (...args: any[]): any => {
  return (eventValues: any[]): boolean => {
    for (let i = 0; i < eventValues.length; i++) {
      for (const key of Object.keys(args[i])) {
        if (JSON.stringify(eventValues[i][key]) !== JSON.stringify(args[i][key])) {
          console.error(`eventValues[${i}][${key}]`, JSON.stringify(eventValues[i][key]));
          console.error(`args[${i}][${key}]`, JSON.stringify(args[i][key]));
          return false;
        }
      }
    }
    return true;
  };
};
