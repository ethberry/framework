import { BigNumber } from "ethers";

export const DND = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
export const SPECIAL = ["strength", "perception", "endurance", "charisma", "intelligence", "agility", "luck"];

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

export const encodeTraits = (traits: Record<string, number>) => {
  return encodeNumbers(Object.values(traits));
};

export const decodeTraits = (encoded: BigNumber, traits = DND) => {
  return decodeNumber(encoded)
    .slice(-traits.length)
    .reduceRight((memo, value, i) => ({ [traits[i]]: value, ...memo }), {} as Record<string, number>);
};
