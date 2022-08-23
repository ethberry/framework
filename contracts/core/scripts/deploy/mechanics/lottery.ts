import { ethers } from "hardhat";
import { Contract } from "ethers";
import { baseTokenURI, royalty, tokenName } from "../../../test/constants";
import { blockAwait } from "../../utils/blockAwait";

export async function deployLottery(contracts: Record<string, Contract>) {
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
