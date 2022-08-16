import { ethers } from "hardhat";
import { Contract } from "ethers";

export async function deployUsdt(contracts: Record<string, Contract>) {
  const usdtFactory = await ethers.getContractFactory("TetherToken");
  contracts.usdt = await usdtFactory.deploy(100000000000, "Tether USD", "USDT", 6);
}
