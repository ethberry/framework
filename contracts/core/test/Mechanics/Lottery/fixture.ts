import "@nomiclabs/hardhat-waffle";

import { ethers, network } from "hardhat";
import { Contract, utils } from "ethers";

import { tokenName } from "@gemunion/contracts-constants";

import { getContractName } from "../../utils";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { deployERC20 } from "../../ERC20/shared/fixtures";
import { wrapSignature } from "./utils";

export async function deployLottery(): Promise<{
  erc20Instance: Contract;
  erc721Instance: Contract;
  lotteryInstance: Contract;
  generateSignature: any;
}> {
  const [owner] = await ethers.getSigners();

  const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));

  const erc20Instance = await deployERC20("ERC20Simple", { amount: utils.parseEther("200000") });
  const erc721TicketInstance = await deployERC721("ERC721Ticket");

  const lotteryInstance = await factory.deploy(tokenName, erc721TicketInstance.address, erc20Instance.address);

  return {
    erc20Instance,
    erc721Instance: erc721TicketInstance,
    lotteryInstance,
    generateSignature: wrapSignature(await ethers.provider.getNetwork(), lotteryInstance, owner),
  };
}
