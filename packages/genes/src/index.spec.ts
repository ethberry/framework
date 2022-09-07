import { BigNumber } from "ethers";

import { encodeNumbers, decodeNumber } from ".";

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
    it("should encode", () => {
      const result = encodeNumbers(data);
      expect(result).toEqual(dna);
    });
  });
  describe("decodeNumber", () => {
    it("should decode", () => {
      const result = decodeNumber(dna);
      expect(result).toMatchObject(data);
    });
  });
});
