import { ethers } from "hardhat";
import { BigNumber } from "ethers";

import { decimals, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

export async function deployLinkVrfFixture() {
  const [owner] = await ethers.getSigners();
  // Deploy Chainlink & Vrf contracts
  const link = await ethers.getContractFactory("LinkErc20");
  const linkInstance = await link.deploy(tokenName, tokenSymbol);
  await linkInstance.deployed();
  // console.info(`LINK_ADDR=${linkInstance.address}`);
  const linkAmountInWei = BigNumber.from("10000000000000").mul(decimals);
  await linkInstance.mint(owner.address, linkAmountInWei);
  const vrfFactory = await ethers.getContractFactory("VRFCoordinatorMock");
  const vrfInstance = await vrfFactory.deploy(linkInstance.address);
  await vrfInstance.deployed();
  // console.info(`VRF_ADDR=${vrfInstance.address}`);
  return { linkInstance, vrfInstance };
}

export async function attachLinkVrfFixture(linkAddr: string, vrfAddr: string) {
  const [owner] = await ethers.getSigners();
  // Deploy Chainlink & Vrf contracts
  const link = await ethers.getContractFactory("LinkErc20");
  const linkInstance = link.attach(linkAddr);

  const linkAmountInWei = BigNumber.from("10000000000000").mul(decimals);
  await linkInstance.mint(owner.address, linkAmountInWei);
  const vrfFactory = await ethers.getContractFactory("VRFCoordinatorMock");
  const vrfInstance = vrfFactory.attach(vrfAddr);

  return { linkInstance, vrfInstance };
}
