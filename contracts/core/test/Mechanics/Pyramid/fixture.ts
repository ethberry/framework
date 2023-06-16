import "@nomicfoundation/hardhat-toolbox";

import { ethers } from "hardhat";

export async function deployPyramid(): Promise<any> {
  const [owner] = await ethers.getSigners();
  const factory = await ethers.getContractFactory("Pyramid");
  return factory.deploy([owner.address], [100]);
}
