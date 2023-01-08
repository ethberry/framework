import "@nomiclabs/hardhat-waffle";

import { ethers } from "hardhat";
import { Contract } from "ethers";

export async function deployPyramid(): Promise<Contract> {
  const factory = await ethers.getContractFactory("Pyramid");
  return factory.deploy();
}
