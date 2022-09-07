import { ethers } from "hardhat";

import { baseTokenURI, royalty } from "../../constants";

export async function deployErc1155Fixture(name: string) {
  const erc1155Factory = await ethers.getContractFactory(name);
  const erc1155Instance = await erc1155Factory.deploy(royalty, baseTokenURI);

  return {
    contractInstance: erc1155Instance,
  };
}
