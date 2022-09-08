import { BigNumber } from "ethers";

const DND = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

export const encodeNumbers = (numbers: Array<number>, size = 32) => {
  let encoded = BigNumber.from(0);
  numbers.reverse().forEach((number, i) => {
    encoded = encoded.or(BigNumber.from(number).shl(i * size));
  });
  return encoded;
};

export const decodeNumber = (encoded: BigNumber, size = 32) => {
  return new Array(256 / size)
    .fill(null)
    .map((_e, i) =>
      encoded
        .shr(i * size)
        .mask(size)
        .toNumber(),
    )
    .reverse();
};

export const encodeGenes = (genes: Record<string, number>) => {
  return encodeNumbers(Object.values(genes));
};

export const decodeGenes = (encoded: BigNumber, genes = DND) => {
  return decodeNumber(encoded)
    .slice(-genes.length)
    .reduceRight((memo, value, i) => ({ [genes[i]]: value, ...memo }), {} as Record<string, number>);
};
