import { BigNumber, constants, utils } from "ethers";

import { nonce } from "@gemunion/contracts-constants";

import { getNumbers } from "./utils";

export const tokenId = 1;
export const tokenIds = [1];
export const tokenIdsZero = [0];
export const templateId = 1;
export const templateIds = [1];
export const cap = constants.WeiPerEther.mul(1000000000);

export const amountWei = "10000000000000000";
export const amountWeiEth = BigNumber.from("10000000000000000");
export const tokenZero = "0x0000000000000000000000000000000000000000";
export const period = 60 * 60 * 24 * 365; // a year in seconds
export const _stakePeriod = 300; // 5 minutes in seconds

export const defaultNumbers = getNumbers();
export const span = 300;
export const maxStake = 5;

// EXCHANGE
export const externalId = 123;
export const expiresAt = 0;
export const extra = utils.formatBytes32String("0x");

export const params = {
  nonce,
  externalId,
  expiresAt,
  referrer: constants.AddressZero,
  extra,
};

export const contractTemplate = "SIMPLE";
export const subscriptionId = 1;

export enum FrameworkInterfaceId {
  ERC721Random = "0x32034d27",
  ERC721Upgradable = "0x45977d03",
  Grade = "0x381b3743",
  Mystery = "0xf0f47261",
}
