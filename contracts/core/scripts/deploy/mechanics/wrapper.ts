import { ethers } from "hardhat";
import { Contract } from "ethers";
import { blockAwait, blockAwait2 } from "../../utils/blockAwait";
import { baseTokenURI, royalty } from "../../../test/constants";

export async function deployWrapper(contracts: Record<string, Contract>) {
  const erc721WrapFactory = await ethers.getContractFactory("ERC721TokenWrapper");
  contracts.erc721Wrapper = await erc721WrapFactory.deploy("WRAPPER", "WRAP", royalty, baseTokenURI);
  await blockAwait2(30000);
  await blockAwait();
}
