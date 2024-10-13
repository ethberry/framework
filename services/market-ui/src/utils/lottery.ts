import { IAsset } from "@framework/types";

export const coefficient = [0, 15, 50, 70, 110, 140, 220];

export const getPrizeAmount = (aggregation: Array<number>, match: number, total: bigint): string => {
  let sumc = 0;
  for (let l = 0; l < coefficient.length; l++) {
    const ag = aggregation[l];
    const co = coefficient[l];
    sumc = sumc + ag * co;
  }

  const point = BigInt(total) / BigInt(sumc);

  const prize = point * BigInt(coefficient[match]);
  return prize.toString();
};

export const getPrizeAsset = (
  pot: IAsset | undefined,
  match: number,
  aggregation: Array<number>,
): IAsset | undefined => {
  if (pot) {
    const prize = pot.components.map(comp => {
      return Object.assign(comp, { amount: getPrizeAmount(aggregation, match, comp.amount) });
    });
    return Object.assign(pot, { components: prize });
  } else {
    return undefined;
  }
};
