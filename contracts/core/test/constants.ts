import { utils, BigNumber } from "ethers";

export const baseTokenURI = "http://localhost:3000"; // no trailing slash
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
export const _stakePeriod = 300; // 5 minutes in seconds

export const nonce = utils.formatBytes32String("nonce");

// Hardhat addresses
export const LINK_ADDR = "0x8D81A3DCd17030cD5F23Ac7370e4Efb10D2b3cA4";
export const VRF_ADDR = "0xa722bdA6968F50778B973Ae2701e90200C564B49";
// LINK_ADDR=0x5FbDB2315678afecb367f032d93F642f64180aa3
// VRF_ADDR=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
// LINK_ADDR=0x8D81A3DCd17030cD5F23Ac7370e4Efb10D2b3cA4
// VRF_ADDR=0xa722bdA6968F50778B973Ae2701e90200C564B49
