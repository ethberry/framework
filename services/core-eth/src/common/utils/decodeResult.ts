export const decodeNumber = (encoded: bigint, size = 32) => {
  const mask = (1n << BigInt(size)) - 1n;
  return new Array(256 / size)
    .fill(null)
    .map((_e, i) => {
      const shr = encoded >> BigInt(i * size);
      const masked = shr & mask;
      return Number(masked);
    })
    .reverse();
};

export const decodeExternalId = (encoded: bigint, keys: Array<string>) => {
  return decodeNumber(encoded)
    .slice(-keys.length)
    .reduceRight((memo, value, i) => ({ [keys[i]]: value, ...memo }), {} as Record<string, number>);
};
