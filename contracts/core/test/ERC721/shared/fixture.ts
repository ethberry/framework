import { ethers } from "hardhat";
import { baseTokenURI, royalty, tokenName, tokenSymbol } from "../../constants";

export async function deployErc721Fixture(name: string) {
  const erc721Factory = await ethers.getContractFactory(name);
  const erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

  const erc721ReceiverFactory = await ethers.getContractFactory("ERC721ReceiverMock");
  const erc721ReceiverInstance = await erc721ReceiverFactory.deploy();

  const erc721NonReceiverFactory = await ethers.getContractFactory("ERC721NonReceiverMock");
  const erc721NonReceiverInstance = await erc721NonReceiverFactory.deploy();

  return {
    contractInstance: erc721Instance,
    erc721ReceiverInstance,
    erc721NonReceiverInstance,
  };
}
