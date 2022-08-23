import { ethers } from "hardhat";
import { Contract, constants } from "ethers";
import { baseTokenURI, royalty, tokenName } from "../../../test/constants";
import { blockAwait } from "../../utils/blockAwait";

export async function deployLotteryProd(contracts: Record<string, Contract>) {
  const amount = constants.WeiPerEther.mul(1e6);
  const [owner] = await ethers.getSigners();
  const erc20SimpleFactory = await ethers.getContractFactory("ERC20Simple");
  const erc20SimpleInstance = await erc20SimpleFactory.deploy("Space Credits", "GEM20", amount);
  await blockAwait();
  contracts.erc20Simple = erc20SimpleInstance;

  await erc20SimpleInstance.mint(owner.address, amount);
  await blockAwait();
  await erc20SimpleInstance.approve(contracts.exchange.address, amount);
  await blockAwait();

  const erc721LotteryFactory = await ethers.getContractFactory("ERC721Ticket");
  contracts.erc721Lottery = await erc721LotteryFactory.deploy("LOTTERY TICKET", "LOTT721", royalty, baseTokenURI);
  await blockAwait();

  const lotteryFactory = await ethers.getContractFactory("Lottery");
  contracts.lottery = await lotteryFactory.deploy(
    tokenName,
    contracts.erc721Lottery.address,
    contracts.erc20Simple.address,
  );
  await blockAwait();
}
