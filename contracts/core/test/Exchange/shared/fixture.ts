import { ethers, network } from "hardhat";

import {
  amount,
  baseTokenURI,
  METADATA_ROLE,
  MINTER_ROLE,
  royalty,
  tokenName,
  tokenSymbol,
} from "@gemunion/contracts-constants";

import { wrapManyToManySignature, wrapOneToManySignature, wrapOneToOneSignature } from "./utils";
import { getContractName } from "../../utils";

export async function deployExchangeFixture() {
  const [owner] = await ethers.getSigners();

  const exchangeFactory = await ethers.getContractFactory("Exchange");
  const exchangeInstance = await exchangeFactory.deploy(tokenName, [owner.address], [100]);

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

export async function deployErc20Base(name: string, exchangeInstance: any): Promise<any> {
  const erc20Factory = await ethers.getContractFactory(name);
  const erc20Instance: any = await erc20Factory.deploy(tokenName, tokenSymbol, amount * 10n);
  await erc20Instance.grantRole(MINTER_ROLE, await exchangeInstance.getAddress());

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return erc20Instance;
}

export async function deployErc721Base(name: string, exchangeInstance: any): Promise<any> {
  const erc721Factory = await ethers.getContractFactory(getContractName(name, network.name));
  const erc721Instance: any = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
  await erc721Instance.grantRole(MINTER_ROLE, await exchangeInstance.getAddress());
  await erc721Instance.grantRole(METADATA_ROLE, await exchangeInstance.getAddress());

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return erc721Instance;
}

export async function deployErc1155Base(name: string, exchangeInstance: any): Promise<any> {
  const erc1155Factory = await ethers.getContractFactory(name);
  const erc1155Instance: any = await erc1155Factory.deploy(royalty, baseTokenURI);
  await erc1155Instance.grantRole(MINTER_ROLE, await exchangeInstance.getAddress());

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return erc1155Instance;
}

export async function deployContractManager(exchangeInstance: any): Promise<any> {
  const managerFactory = await ethers.getContractFactory("ContractManager");
  const managerInstance = await managerFactory.deploy();

  await managerInstance.addFactory(await exchangeInstance.getAddress(), MINTER_ROLE);
  await managerInstance.addFactory(await exchangeInstance.getAddress(), METADATA_ROLE);

  return managerInstance;
}
