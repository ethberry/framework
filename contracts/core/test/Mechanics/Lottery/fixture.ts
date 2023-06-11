import "@nomicfoundation/hardhat-toolbox";

import { ethers, network } from "hardhat";
import { Contract, parseEther } from "ethers";

import { getContractName } from "../../utils";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { deployERC20 } from "../../ERC20/shared/fixtures";
import { wrapRaffleSignature, wrapSignature } from "./utils";

interface ILotteryConfig {
  timeLagBeforeRelease: number;
  commission: number;
}

export async function deployLottery(config: ILotteryConfig): Promise<{
  erc20Instance: any;
  erc721Instance: any;
  lotteryInstance: any;
  generateSignature: any;
}> {
  const [owner] = await ethers.getSigners();
  const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));

  const erc20Instance: any = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
  const erc721TicketInstance: any = await deployERC721("ERC721LotteryTicket");

  const lotteryInstance: any = await factory.deploy(config);

  return {
    erc20Instance,
    erc721Instance: erc721TicketInstance,
    lotteryInstance,
    generateSignature: wrapSignature(await ethers.provider.getNetwork(), lotteryInstance, owner),
  };
}

export async function deployRaffle(config: ILotteryConfig): Promise<{
  erc20Instance: any;
  erc721Instance: any;
  raffleInstance: any;
  generateSignature: any;
}> {
  const [owner] = await ethers.getSigners();
  const factory = await ethers.getContractFactory(getContractName("RaffleRandom", network.name));

  const erc20Instance: any = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
  const erc721TicketInstance: any = await deployERC721("ERC721RaffleTicket");

  const raffleInstance: any = await factory.deploy(config);

  return {
    erc20Instance,
    erc721Instance: erc721TicketInstance,
    raffleInstance,
    generateSignature: wrapRaffleSignature(await ethers.provider.getNetwork(), raffleInstance, owner),
  };
}
