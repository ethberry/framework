import { DismantleStrategy, IDismantle } from "@framework/types";

export const getMultiplier = (level: number, { dismantleStrategy, growthRate }: IDismantle) => {
  if (dismantleStrategy === DismantleStrategy.FLAT) {
    return 1;
  } else if (dismantleStrategy === DismantleStrategy.LINEAR) {
    return level;
  } else if (dismantleStrategy === DismantleStrategy.EXPONENTIAL) {
    return (1 + growthRate / 100) ** level;
  } else {
    throw new Error("unknownStrategy");
  }
};
