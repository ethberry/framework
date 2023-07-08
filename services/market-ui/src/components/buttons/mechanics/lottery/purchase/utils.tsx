import { utils } from "ethers";

export const boolArrayToByte32 = (booleans: Array<boolean>) => {
  if (booleans.length > 256) {
    throw new Error("Array length cannot exceed 256");
  }
  const result: Array<string> = [];
  booleans.forEach((value, index) => {
    if (value) {
      result.push(utils.hexZeroPad(utils.hexValue(index + 1), 1));
    }
  });
  const concat = `0x${result.map(res => res.substring(2)).join("")}`;

  return utils.hexZeroPad(concat, 32);
};
