import { utils, BigNumber } from "ethers";

export const baseTokenURI = "http://localhost/";
export const tokenSymbol = "SYMBOL";
export const tokenName = "Lorem ipsum...";
export const tokenId = 1;
export const templateId = 1;
export const royalty = 100;

export const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const MINTER_ROLE = utils.id("MINTER_ROLE");
export const PAUSER_ROLE = utils.id("PAUSER_ROLE");
export const SNAPSHOT_ROLE = utils.id("SNAPSHOT_ROLE");

export const decimals = BigNumber.from(10).pow(18);
export const amount = 10000;
export const period = 60 * 60 * 24 * 365; // a year in seconds

export const nonce = utils.formatBytes32String("nonce");
