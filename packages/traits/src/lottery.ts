import { toBeHex, zeroPadValue } from "ethers";

export const boolArrayToByte32 = (booleans: Array<boolean>) => {
  if (booleans.length > 256) {
    throw new Error("Array length cannot exceed 256");
  }

  let result = 0n;
  booleans.forEach((value, index) => {
    if (value) {
      result |= 1n << BigInt(index);
    }
  });

  return zeroPadValue(toBeHex(result), 32);
};

export const byte32ToBoolArray = (byte32: string) => {
  const num = BigInt(byte32);
  const result = [];
  for (let i = 0; i < 256; i++) {
    result.push((num & (1n << BigInt(i))) !== 0n);
  }

  return result;
};
