import { ethers } from "hardhat";
import { BigNumber } from "ethers";

import { encodeNumbers, decodeNumber } from "@gemunion/genes";

// Patch BigNumber
Object.defineProperties(BigNumber.prototype, {
  toJSON: {
    value: function (this: BigNumber) {
      return this.toString();
    },
  },
});

export const transform = (args: any): Record<string, any> => {
  return JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(args).splice(args.length)))) as Record<
    string,
    any
  >;
};

const data = {
  strength: 1,
  dexterity: 2,
  constitution: 18,
  intelligence: 128,
  wisdom: 256,
  charisma: 1024,
};

async function main() {
  const interfaceIdCalculator = await ethers.getContractFactory("Genes");

  const instance = await interfaceIdCalculator.deploy();

  const encodedSOL = await instance.encodeNumbers(data);
  const encodedJS = encodeNumbers(data);
  console.info(encodedSOL, encodedJS);

  const decodedSOL = await instance.decodeNumber(encodedSOL);
  const decodedJS = decodeNumber(encodedJS);
  console.info(transform(decodedSOL), decodedJS);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
