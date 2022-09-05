import { BigNumber } from "ethers";

export const encodeNumbers = ({
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

export const decodeNumber = (encoded: BigNumber) => {
  return {
    strength: encoded.shr(160).mask(32).toNumber(),
    dexterity: encoded.shr(128).mask(32).toNumber(),
    constitution: encoded.shr(96).mask(32).toNumber(),
    intelligence: encoded.shr(64).mask(32).toNumber(),
    wisdom: encoded.shr(32).mask(32).toNumber(),
    charisma: encoded.shr(0).mask(32).toNumber(),
  };
};
