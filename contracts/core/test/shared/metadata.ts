import { BigNumber } from "ethers";

export enum MetadataHash {
  "0xe2db241bb2fe321e8c078a17b0902f9429cee78d5f3486725d73d0356e97c842" = "TEMPLATE_ID",
  "0x76e34cd5c7c46b6bfe6b1da94d54447ea83a4af449bc62a0ef3ecae24c08031a" = "GRADE",
  "0xda9488a573bb2899ea5782d71e9ebaeb1d8291bf3812a066ec86608a697c51fc" = "RARITY",
  "0x8e3ddc4aa9e11e826949389b9fc38032713cef66f38657aa6e1599905d26e564" = "GENES",
}

export const metadataKeysArray = ["TEMPLATE_ID", "GENES"];

export const decodeMetadata = function (tokenMetaData: Array<any>): Record<string, string> {
  return tokenMetaData.reduce(
    (memo: Record<string, string>, current: { key: keyof typeof MetadataHash; value: string }) =>
      Object.assign(memo, {
        [MetadataHash[current.key]]: BigNumber.from(current.value).toString(),
      }),
    {} as Record<string, string>,
  ) as Record<string, string>;
};

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

export const decodeGenes = (encoded: BigNumber, genes = metadataKeysArray) => {
  return decodeNumber(encoded)
    .slice(-genes.length)
    .reduceRight((memo, value, i) => ({ [genes[i]]: value, ...memo }), {} as Record<string, number>);
};
