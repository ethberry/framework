import "@nomicfoundation/hardhat-toolbox";

import { ethers, network } from "hardhat";
import { Contract, utils } from "ethers";

import { tokenName } from "@gemunion/contracts-constants";

import { getContractName } from "../../utils";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { deployERC20 } from "../../ERC20/shared/fixtures";
import { wrapRaffleSignature, wrapSignature } from "./utils";

interface ILotteryConfig {
  lotteryWallet?: string;
  timeLagBeforeRelease: number;
  maxTickets: number;
  commission: number;
}

export async function deployLottery(config: ILotteryConfig): Promise<{
  erc20Instance: Contract;
  erc721Instance: Contract;
  lotteryInstance: Contract;
  lotteryWalletInstance: Contract;
  generateSignature: any;
}> {
  const [owner] = await ethers.getSigners();
  const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));
  const walletFactory = await ethers.getContractFactory("LotteryWallet");

  const erc20Instance = await deployERC20("ERC20Simple", { amount: utils.parseEther("200000") });
  const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

  const lotteryWalletInstance = await walletFactory.deploy([owner.address], [100]);

  Object.assign(config, { lotteryWallet: lotteryWalletInstance.address });

  const lotteryInstance = await factory.deploy(tokenName, config);

  return {
    erc20Instance,
    erc721Instance: erc721TicketInstance,
    lotteryInstance,
    lotteryWalletInstance,
    generateSignature: wrapSignature(await ethers.provider.getNetwork(), lotteryInstance, owner),
  };
}

export async function deployLotteryRaffle(config: ILotteryConfig): Promise<{
  erc20Instance: Contract;
  erc721Instance: Contract;
  lotteryInstance: Contract;
  lotteryWalletInstance: Contract;
  generateSignature: any;
}> {
  const [owner] = await ethers.getSigners();
  const factory = await ethers.getContractFactory(getContractName("RaffleRandom", network.name));
  const walletFactory = await ethers.getContractFactory("RaffleWallet");

  const erc20Instance = await deployERC20("ERC20Simple", { amount: utils.parseEther("200000") });
  const erc721TicketInstance = await deployERC721("ERC721RaffleTicket");

  const lotteryWalletInstance = await walletFactory.deploy([owner.address], [100]);

  Object.assign(config, { lotteryWallet: lotteryWalletInstance.address });

  const lotteryInstance = await factory.deploy(tokenName, config);

  return {
    erc20Instance,
    erc721Instance: erc721TicketInstance,
    lotteryInstance,
    lotteryWalletInstance,
    generateSignature: wrapRaffleSignature(await ethers.provider.getNetwork(), lotteryInstance, owner),
  };
}
