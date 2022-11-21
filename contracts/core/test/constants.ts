import { BigNumber, constants, utils } from "ethers";
import { getNumbers } from "./utils";

export const baseTokenURI = "http://localhost:3000/metadata"; // no trailing slash
export const tokenSymbol = "SYMBOL";
export const tokenName = "Lorem ipsum...";
export const tokenId = 1;
export const templateId = 1;
export const royalty = 100;
export const cap = constants.WeiPerEther.mul(1000000000);

export const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const METADATA_ADMIN_ROLE = utils.id("METADATA_ADMIN_ROLE");
export const MINTER_ROLE = utils.id("MINTER_ROLE");
export const PAUSER_ROLE = utils.id("PAUSER_ROLE");
export const SNAPSHOT_ROLE = utils.id("SNAPSHOT_ROLE");

export const decimals = BigNumber.from(10).pow(18);
export const amount = 10000;
export const amountWei = "10000000000000000";
export const amountWeiEth = BigNumber.from("10000000000000000");
export const tokenZero = "0x0000000000000000000000000000000000000000";
export const period = 60 * 60 * 24 * 365; // a year in seconds
export const _stakePeriod = 300; // 5 minutes in seconds

export const nonce = utils.formatBytes32String("nonce");
export const defaultNumbers = getNumbers();
export const span = 300;

// CHAINLINK
// Hardhat addresses
export const LINK_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const VRF_ADDR = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

// EXCHANGE
export const externalId = 123;
export const expiresAt = 0;

export const params = {
  nonce,
  externalId,
  expiresAt,
  referrer: constants.AddressZero,
};

export const featureIds = [1, 3];
