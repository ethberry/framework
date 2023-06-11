import "@nomicfoundation/hardhat-toolbox";

import { ethers, network } from "hardhat";
import { parseEther } from "ethers";

import { tokenName } from "@gemunion/contracts-constants";

import { getContractName } from "../../utils";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { deployERC1363 } from "../../ERC20/shared/fixtures";
import { wrapSignature } from "./utils";

export async function deployLottery(): Promise<{
  erc20Instance: any;
  erc721Instance: any;
  lotteryInstance: any;
  generateSignature: any;
}> {
  const [owner] = await ethers.getSigners();
  const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));

  const erc20Instance = await deployERC1363("ERC20Simple", { amount: parseEther("200000") });
  const erc721LotteryInstance = await deployERC721("ERC721Lottery");

  const lotteryInstance = await factory.deploy(
    tokenName,
    await erc721LotteryInstance.getAddress(),
    await erc20Instance.getAddress(),
  );

  return {
    erc20Instance,
    erc721Instance: erc721LotteryInstance,
    lotteryInstance,
    generateSignature: wrapSignature(await ethers.provider.getNetwork(), lotteryInstance, owner),
  };
}
