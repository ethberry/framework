import { ethers } from "hardhat";

import { baseTokenURI, royalty } from "../../constants";

export async function deployErc1155Base(name: string) {
  const erc1155Factory = await ethers.getContractFactory(name);
  const erc1155Instance = await erc1155Factory.deploy(royalty, baseTokenURI);

  return {
    contractInstance: erc1155Instance,
  };
}

export async function deployErc1155NonReceiver() {
  const erc1155NonReceiverFactory = await ethers.getContractFactory("ERC1155NonReceiverMock");
  const erc1155NonReceiverInstance = await erc1155NonReceiverFactory.deploy();

  return {
    contractInstance: erc1155NonReceiverInstance,
  };
}

export async function deployErc1155Receiver() {
  const erc1155ReceiverFactory = await ethers.getContractFactory("ERC1155ReceiverMock");
  const erc1155ReceiverInstance = await erc1155ReceiverFactory.deploy();

  return {
    contractInstance: erc1155ReceiverInstance,
  };
}
