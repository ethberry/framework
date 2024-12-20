import { BigNumber, utils } from "ethers";

// TODO use ethers v6
export const decodeNumbersToArr = (numberStr: string, len = 36): Array<boolean> => {
  const arr = [];
  for (let i = 1; i < len + 1; i++) {
    arr.push(utils.arrayify(BigNumber.from(numberStr)).includes(i));
  }
  return arr;
};

export const decodeNumbers = (numberStr: string): string => {
  const arr = [];
  const uint8Arr = utils.arrayify(BigNumber.from(numberStr));
  for (let i = 0; i < uint8Arr.length; i++) {
    arr.push(uint8Arr[i]);
  }
  return arr.join(", ");
};

export const getNumbers = (numbers: Array<boolean>): string => {
  return numbers
    ? numbers
        .reduce((memo, current, i) => {
          if (current) {
            memo.push(i + 1);
          }
          return memo;
        }, [] as Array<number>)
        .join(", ")
    : "";
};

export const getWinners = (ticketNumbers: Array<boolean>, roundNumbers: Array<boolean>) => {
  const tN = getNumbers(ticketNumbers).split(", ");
  const rN = getNumbers(roundNumbers).split(", ");
  const count = rN.filter(i => tN.includes(i)).length;
  return count ? `${count} of 6` : "";
};
