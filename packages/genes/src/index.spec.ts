import { BigNumber } from "ethers";

import { decodeGenes, decodeNumber, encodeGenes, encodeNumbers } from ".";

const data = {
  strength: 1,
  dexterity: 2,
  constitution: 18,
  intelligence: 128,
  wisdom: 256,
  charisma: 1024,
};

const dna = BigNumber.from("0x010000000200000012000000800000010000000400");

describe("Genes", () => {
  describe("encodeNumbers", () => {
    it("should encode numbers", () => {
      const result = encodeNumbers(Object.values(data));
      expect(result).toEqual(dna);
    });
  });

  describe("decodeNumber", () => {
    it("should decode numbers", () => {
      const result = decodeNumber(dna);
      expect(result).toEqual([0, 0, 1, 2, 18, 128, 256, 1024]);
    });
  });

  describe("encodeGenes", () => {
    it("should encode genes", () => {
      const result = encodeGenes(data);
      expect(result).toEqual(dna);
    });
  });

  describe("decodeGenes", () => {
    it("should decode genes", () => {
      const result = decodeGenes(dna);
      expect(result).toMatchObject(data);
    });
  });
});
