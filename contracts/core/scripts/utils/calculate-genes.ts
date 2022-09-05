import { ethers } from "hardhat";
import { BigNumber } from "ethers";

// Patch BigNumber
Object.defineProperties(BigNumber.prototype, {
  toJSON: {
    value: function (this: BigNumber) {
      return this.toString();
    },
  },
});

const encodeNumbers = ({
  strength,
  dexterity,
  constitution,
  intelligence,
  wisdom,
  charisma,
}: {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}) => {
  let encoded = BigNumber.from(0);
  encoded = encoded.or(BigNumber.from(strength).shl(160));
  encoded = encoded.or(BigNumber.from(dexterity).shl(128));
  encoded = encoded.or(BigNumber.from(constitution).shl(96));
  encoded = encoded.or(BigNumber.from(intelligence).shl(64));
  encoded = encoded.or(BigNumber.from(wisdom).shl(32));
  encoded = encoded.or(BigNumber.from(charisma).shl(0));
  return encoded;
};

const decodeNumber = (encoded: BigNumber) => {
  return {
    strength: encoded.shr(160).mask(32).toNumber(),
    dexterity: encoded.shr(128).mask(32).toNumber(),
    constitution: encoded.shr(96).mask(32).toNumber(),
    intelligence: encoded.shr(64).mask(32).toNumber(),
    wisdom: encoded.shr(32).mask(32).toNumber(),
    charisma: encoded.shr(0).mask(32).toNumber(),
  };
};

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
