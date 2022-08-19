import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { wallets } from "@gemunion/constants";

export async function deployERC20(contracts: Record<string, Contract>) {
  const [owner] = await ethers.getSigners();
  const amount = constants.WeiPerEther.mul(1e6);

  const erc20SimpleFactory = await ethers.getContractFactory("ERC20Simple");
  const erc20SimpleInstance = await erc20SimpleFactory.deploy("Space Credits", "GEM20", amount);
  await erc20SimpleInstance.mint(owner.address, amount);
  await erc20SimpleInstance.approve(contracts.exchange.address, amount);
  contracts.erc20Simple = erc20SimpleInstance;

  const erc20InactiveFactory = await ethers.getContractFactory("ERC20Simple");
  contracts.erc20Inactive = await erc20InactiveFactory.deploy("ERC20 INACTIVE", "OFF20", amount);

  const erc20NewFactory = await ethers.getContractFactory("ERC20Simple");
  contracts.erc20New = await erc20NewFactory.deploy("ERC20 NEW", "NEW20", amount);

  const erc20BlacklistFactory = await ethers.getContractFactory("ERC20Blacklist");
  const erc20BlacklistInstance = await erc20BlacklistFactory.deploy("ERC20 BLACKLIST", "BL20", amount);
  await erc20BlacklistInstance.blacklist(wallets[1]);
  await erc20BlacklistInstance.blacklist(wallets[2]);
  contracts.erc20Blacklist = erc20BlacklistInstance;
}
