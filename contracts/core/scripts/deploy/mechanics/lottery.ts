import { ethers } from "hardhat";
import { Contract, constants } from "ethers";
import { baseTokenURI, royalty, tokenName } from "../../../test/constants";
import { blockAwait } from "../../utils/blockAwait";

export async function deployLottery(contracts: Record<string, Contract>) {
  const amount = constants.WeiPerEther.mul(1e6);
  const [owner] = await ethers.getSigners();
  await blockAwait(3);
  const erc20SimpleFactory = await ethers.getContractFactory("ERC20Simple");
  const erc20SimpleInstance = await erc20SimpleFactory.deploy("Space Credits", "GEM20", amount);
  console.info("erc20Simple deployed:", erc20SimpleInstance.address);

  await blockAwait(3);
  const tx = await erc20SimpleInstance.mint(owner.address, amount);
  console.info("mint, tx", tx.hash);
  await blockAwait(3);
  const tx1 = await erc20SimpleInstance.approve(contracts.exchange.address, amount);
  console.info("approve, tx", tx1.hash);
  contracts.erc20Simple = erc20SimpleInstance;
  await blockAwait(3);

  const erc721LotteryFactory = await ethers.getContractFactory("ERC721Ticket");
  contracts.erc721Lottery = await erc721LotteryFactory.deploy("LOTTERY TICKET", "LOTT721", royalty, baseTokenURI);
  console.info("erc721Lottery deployed:", contracts.erc721Lottery.address);

  await blockAwait(3);

  const lotteryFactory = await ethers.getContractFactory("Lottery");
  contracts.lottery = await lotteryFactory.deploy(
    tokenName,
    contracts.erc721Lottery.address,
    contracts.erc20Simple.address,
  );
  console.info("lottery deployed:", contracts.lottery.address);
}
