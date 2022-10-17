import { ethers } from "hardhat";

import { Exchange } from "../../../../typechain-types";
import { amount, baseTokenURI, MINTER_ROLE, royalty, tokenName, tokenSymbol } from "../../../constants";
import { wrapManyToManySignature, wrapOneToManySignature, wrapOneToOneSignature } from "./utils";

export async function deployExchangeFixture() {
  const [owner] = await ethers.getSigners();

  const exchangeFactory = await ethers.getContractFactory("Exchange");
  const exchangeInstance = await exchangeFactory.deploy(tokenName);

  const network = await ethers.provider.getNetwork();

  const generateOneToOneSignature = wrapOneToOneSignature(network, exchangeInstance, owner);
  const generateOneToManySignature = wrapOneToManySignature(network, exchangeInstance, owner);
  const generateManyToManySignature = wrapManyToManySignature(network, exchangeInstance, owner);

  return {
    contractInstance: exchangeInstance,
    generateOneToOneSignature,
    generateOneToManySignature,
    generateManyToManySignature,
  };
}

export async function deployErc20Base(name: string, exchangeInstance: Exchange) {
  const erc20Factory = await ethers.getContractFactory(name);
  const erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount * 10);
  await erc20Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

  return {
    contractInstance: erc20Instance,
  };
}

export async function deployErc721Base(name: string, exchangeInstance: Exchange) {
  const erc721Factory = await ethers.getContractFactory(name);
  const erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
  await erc721Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

  return {
    contractInstance: erc721Instance,
  };
}

export async function deployErc1155Base(name: string, exchangeInstance: Exchange) {
  const erc1155Factory = await ethers.getContractFactory(name);
  const erc1155Instance = await erc1155Factory.deploy(royalty, baseTokenURI);
  await erc1155Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

  return {
    contractInstance: erc1155Instance,
  };
}
