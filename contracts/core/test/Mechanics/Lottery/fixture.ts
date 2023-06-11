import "@nomicfoundation/hardhat-toolbox";

import { ethers, network } from "hardhat";
import { Contract, utils } from "ethers";

import { getContractName } from "../../utils";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { deployERC20 } from "../../ERC20/shared/fixtures";
import { wrapRaffleSignature, wrapSignature } from "./utils";

interface ILotteryConfig {
  timeLagBeforeRelease: number;
  commission: number;
}

export async function deployLottery(config: ILotteryConfig): Promise<{
  erc20Instance: Contract;
  erc721Instance: Contract;
  lotteryInstance: Contract;
  generateSignature: any;
}> {
  const [owner] = await ethers.getSigners();
  const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));

  const erc20Instance = await deployERC20("ERC20Simple", { amount: utils.parseEther("200000") });
  const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

  const lotteryInstance = await factory.deploy(config);

  return {
    erc20Instance,
    erc721Instance: erc721TicketInstance,
    lotteryInstance,
    generateSignature: wrapSignature(await ethers.provider.getNetwork(), lotteryInstance, owner),
  };
}

export async function deployRaffle(config: ILotteryConfig): Promise<{
  erc20Instance: Contract;
  erc721Instance: Contract;
  raffleInstance: Contract;
  generateSignature: any;
}> {
  const [owner] = await ethers.getSigners();
  const factory = await ethers.getContractFactory(getContractName("RaffleRandom", network.name));

  const erc20Instance = await deployERC20("ERC20Simple", { amount: utils.parseEther("200000") });
  const erc721TicketInstance = await deployERC721("ERC721RaffleTicket");

  const raffleInstance = await factory.deploy(config);

  return {
    erc20Instance,
    erc721Instance: erc721TicketInstance,
    raffleInstance,
    generateSignature: wrapRaffleSignature(await ethers.provider.getNetwork(), raffleInstance, owner),
  };
}
