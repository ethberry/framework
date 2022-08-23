import { ethers } from "hardhat";
import { BigNumber } from "ethers";

import { blockAwait } from "@gemunion/utils-eth";

import { tokenName, tokenSymbol } from "../../test/constants";

async function main() {
  const [owner] = await ethers.getSigners();
  const decimals = BigNumber.from(10).pow(18);
  const linkAmountInWei = BigNumber.from("100000").mul(decimals);

  const link = await ethers.getContractFactory("LinkErc20");
  const linkInstance = await link.deploy(tokenName, tokenSymbol);
  console.info(`LINK_ADDR=${linkInstance.address}`);
  const vrfFactory = await ethers.getContractFactory("VRFCoordinatorMock");
  const vrfInstance = await vrfFactory.deploy(linkInstance.address);
  console.info(`VRF_ADDR=${vrfInstance.address}`);
  // await blockAwait(ethers.provider);
  const tx = await linkInstance.mint(owner.address, linkAmountInWei);
  console.info(`some LINK tokens minted:`, tx.hash);
  // await blockAwait(ethers.provider);
  const linkBalanceOwner = await linkInstance.balanceOf(owner.address);
  console.info("linkBalanceOwner", linkBalanceOwner);

  // Next, add LINK and VRF addresses to MOCK test contract:
  // contracts/binance/contracts/MOCKS/ChainLink/ERC721ChainLinkBesu.sol
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
