import { BigNumber } from "ethers";

import { DiscreteStrategy, IDiscrete } from "@framework/types";

export const getMultiplier = (level: number, amount: string, { discreteStrategy, growthRate }: IDiscrete) => {
  if (discreteStrategy === DiscreteStrategy.FLAT) {
    return BigNumber.from(amount);
  } else if (discreteStrategy === DiscreteStrategy.LINEAR) {
    return BigNumber.from(amount).mul(level);
  } else if (discreteStrategy === DiscreteStrategy.EXPONENTIAL) {
    const exp = (1 + growthRate / 100) ** level;
    const [whole = "", decimals = ""] = exp.toString().split(".");
    return BigNumber.from(amount).mul(`${whole}${decimals}`).div(BigNumber.from(10).pow(decimals.length));
  } else {
    throw new Error("unknownStrategy");
  }
};

export const getEthPrice = (price: Array<{ tokenType: number; amount: BigNumber }>) => {
  return price.reduce((memo, current) => {
    if (current.tokenType === 0) {
      return memo.add(current.amount);
    }
    return memo;
  }, BigNumber.from(0));
};
