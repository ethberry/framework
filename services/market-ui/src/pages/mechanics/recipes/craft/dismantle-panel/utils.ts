import { BigNumber } from "ethers";

import { GradeStrategy } from "@framework/types";

export interface IDismantleMultiplierParameters {
  gradeStrategy: GradeStrategy;
  rarityMultiplier: number;
}

export const getDismantleMultiplier = (
  level: number,
  amount: string,
  gradeStrategy: GradeStrategy,
  rarityMultiplier: number,
) => {
  if (gradeStrategy === GradeStrategy.FLAT) {
    return { amount: BigNumber.from(amount), multiplier: 1 };
  } else if (gradeStrategy === GradeStrategy.LINEAR) {
    return { amount: BigNumber.from(amount).mul(level), multiplier: level };
  } else if (gradeStrategy === GradeStrategy.EXPONENTIAL) {
    const exp = (1 + rarityMultiplier / 100) ** level;
    const [whole = "", decimals = ""] = exp.toString().split(".");
    return {
      amount: BigNumber.from(amount).mul(`${whole}${decimals}`).div(BigNumber.from(10).pow(decimals.length)),
      multiplier: exp,
    };
  } else {
    throw new Error("unknownStrategy");
  }
};
