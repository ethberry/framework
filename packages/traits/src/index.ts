export const DND = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
export const SPECIAL = ["strength", "perception", "endurance", "charisma", "intelligence", "agility", "luck"];

export const encodeNumbers = (numbers: Array<number>, size = 32) => {
  let encoded = 0n;
  numbers.reverse().forEach((number, i) => {
    encoded = encoded | (BigInt(number) << BigInt(i * size));
  });
  return encoded;
};

export const decodeNumber = (encoded: bigint, size = 32) => {
  return new Array(256 / size)
    .fill(null)
    .map((_e, i) => {
      // TODO fixme
      // encoded
      //   .shr(i * size)
      //   .mask(size)
      //   .toNumber(),
      const shr = encoded >> BigInt(i * size);
      const mask = shr * 1n;
      return mask as unknown as number;
    })
    .reverse();
};

export const encodeTraits = (traits: Record<string, number>) => {
  return encodeNumbers(Object.values(traits));
};

export const decodeTraits = (encoded: bigint, traits = DND) => {
  return decodeNumber(encoded)
    .slice(-traits.length)
    .reduceRight((memo, value, i) => ({ [traits[i]]: value, ...memo }), {} as Record<string, number>);
};
