import { Contract, JsonRpcProvider, toBeArray } from "ethers";

import type { ILotteryCurrentRound } from "@framework/types";

import { recursivelyDecodeResult } from "./decodeResult";

export const getLotteryNumbers = (selected: Array<number>) => {
  const numbers: Array<boolean> = new Array(36).fill(false);
  selected.forEach(s => {
    numbers[s] = true;
  });
  return `{${numbers.join(",")}}`;
};

export const getLotteryNumbersArr = (selected: Array<number>) => {
  const numbers: Array<boolean> = new Array(36).fill(false);
  selected.forEach(s => {
    numbers[s] = true;
  });
  return numbers;
};

export const getBytesNumbersArr = (selected = ""): Array<number> => {
  const arrStr = toBeArray(selected);
  const arr = [];
  for (let i = 0; i < arrStr.length; i++) {
    arr.push(Number(arrStr[i]));
  }
  return arr;
};

export const getNumbers = (numbers: Array<boolean>): Array<number> => {
  return numbers
    ? numbers.reduce((memo, current, i) => {
        if (current) {
          memo.push(i + 1);
        }
        return memo;
      }, [] as Array<number>)
    : [];
};

// expect(toBeHex(decodedMeta.NUMBERS, 32)).to.equal(ticketNumbers);
// const ticketNumbers = getNumbersBytes(values);

export const getCurrentLotteryRound = async function (
  address: string,
  abi: any,
  provider: JsonRpcProvider,
): Promise<ILotteryCurrentRound> {
  const contract = new Contract(address, abi, provider);
  const roundInfo = await contract.getCurrentRoundInfo();
  return recursivelyDecodeResult(roundInfo) as ILotteryCurrentRound;
};
