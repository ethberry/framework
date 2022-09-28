import { ethers } from "hardhat";
import { amount, tokenName, tokenSymbol } from "../../constants";

export async function deployErc20Base(name: string) {
  const erc20Factory = await ethers.getContractFactory(name);
  const erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount);

  const erc20NonReceiverFactory = await ethers.getContractFactory("ERC20NonReceiverMock");
  const erc20NonReceiverInstance = await erc20NonReceiverFactory.deploy();

  return {
    contractInstance: erc20Instance,
    erc20NonReceiverInstance,
  };
}
