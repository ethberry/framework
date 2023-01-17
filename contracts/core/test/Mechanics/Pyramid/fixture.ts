import "@nomiclabs/hardhat-waffle";

import { ethers } from "hardhat";
import { Contract } from "ethers";

export async function deployPyramid(): Promise<Contract> {
  const [owner] = await ethers.getSigners();
  const factory = await ethers.getContractFactory("Pyramid");
  return factory.deploy([owner.address], [100]);
}
