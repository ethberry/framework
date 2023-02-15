import { BigNumber, constants } from "ethers";

import { nonce } from "@gemunion/contracts-constants";

import { getNumbers } from "./utils";

export const tokenId = 1;
export const templateId = 1;
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

export const params = {
  nonce,
  externalId,
  expiresAt,
  referrer: constants.AddressZero,
};

export const contractTemplate = "SIMPLE";
