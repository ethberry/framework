import { BigNumber } from "ethers";

import { DismantleStrategy } from "@framework/types";

export const getDismantleMultiplier = (
  amount: string,
  metadata: Record<string, any>,
  dismantleStrategy: DismantleStrategy,
  rarityMultiplier: number,
) => {
  const level = metadata.RARITY
    ? Number(metadata.RARITY)
    : metadata.LEVEL && !metadata.GRADE
    ? Number(metadata.LEVEL)
    : metadata.GRADE && !metadata.LEVEL
    ? Number(metadata.GRADE)
    : metadata.LEVEL && metadata.GRADE
    ? Math.max(...[Number(metadata.LEVEL), Number(metadata.GRADE)])
    : 1;

  if (dismantleStrategy === DismantleStrategy.FLAT) {
    return { amount: BigNumber.from(amount), multiplier: 1 };
  } else if (dismantleStrategy === DismantleStrategy.LINEAR) {
    return { amount: BigNumber.from(amount).mul(level), multiplier: level };
  } else if (dismantleStrategy === DismantleStrategy.EXPONENTIAL) {
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
