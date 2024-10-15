import { BigNumber, BigNumberish } from "ethers";

import { DiscreteStrategy, IDiscrete } from "@framework/types";

export const getMultiplier = (level: number, { discreteStrategy, growthRate }: IDiscrete) => {
  if (discreteStrategy === DiscreteStrategy.FLAT) {
    return 1;
  } else if (discreteStrategy === DiscreteStrategy.LINEAR) {
    return level; // For linear probably need to add step (in token decimals)
  } else if (discreteStrategy === DiscreteStrategy.EXPONENTIAL) {
    return (1 + growthRate / 100) ** level;
  } else {
    throw new Error("unknownStrategy");
  }
};

export const getEthPrice = (price: Array<{ tokenType: number; amount: BigNumberish }>) => {
  return price.reduce((memo, current) => {
    if (current.tokenType === 0) {
      return memo.add(current.amount);
    }
    return memo;
  }, BigNumber.from(0));
};
