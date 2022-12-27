import { ethers } from "hardhat";
import { Contract } from "ethers";

import { blockAwait } from "@gemunion/contracts-utils";
import { baseTokenURI, royalty } from "@gemunion/contracts-constants";

export async function deployWrapper(contracts: Record<string, Contract>) {
  const erc721WrapFactory = await ethers.getContractFactory("ERC721TokenWrapper");
  contracts.erc721Wrapper = await erc721WrapFactory.deploy("WRAPPER", "WRAP", royalty, baseTokenURI);
  await blockAwaitMs(30000);
  await blockAwait();
}
