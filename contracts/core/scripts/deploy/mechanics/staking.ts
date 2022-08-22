import { ethers } from "hardhat";
import { Contract } from "ethers";
import { MINTER_ROLE } from "../../../test/constants";
import { blockAwait } from "../../utils/blockAwait";

export async function deployStaking(contracts: Record<string, Contract>) {
  await blockAwait(3);
  const stakingFactory = await ethers.getContractFactory("Staking");
  const stakingInstance = await stakingFactory.deploy(10);
  console.info("staking deployed:", stakingInstance.address);
  await blockAwait(3);

  contracts.staking = stakingInstance;

  // await stakingInstance.setRules([
  //   {
  //     externalId: 11, // NATIVE > NATIVE
  //     deposit: {
  //       tokenType: 0,
  //       token: constants.AddressZero,
  //       tokenId: 0,
  //       amount: constants.WeiPerEther,
  //     },
  //     reward: {
  //       tokenType: 0,
  //       token: constants.AddressZero,
  //       tokenId: 0,
  //       amount: constants.WeiPerEther.div(100).mul(5), // 5%
  //     },
  //     period: 30 * 84600,
  //     penalty: 1,
  //     recurrent: false,
  //     active: true,
  //   },
  // ]);
  // await blockAwait(3);
  //
  // await stakingInstance.setRules([
  //   {
  //     externalId: 23, // ERC20 > ERC721
  //     deposit: {
  //       tokenType: 1,
  //       token: contracts.erc20Simple.address,
  //       tokenId: 0,
  //       amount: constants.WeiPerEther,
  //     },
  //     reward: {
  //       tokenType: 2,
  //       token: contracts.erc721Random.address,
  //       tokenId: 306001,
  //       amount: 1,
  //     },
  //     period: 30 * 84600,
  //     penalty: 1,
  //     recurrent: false,
  //     active: true,
  //   },
  // ]);
  // await blockAwait(3);
  //
  // await stakingInstance.setRules([
  //   {
  //     externalId: 45, // ERC998 > ERC1155
  //     deposit: {
  //       tokenType: 3,
  //       token: contracts.erc998Random.address,
  //       tokenId: 0,
  //       amount: 1,
  //     },
  //     reward: {
  //       tokenType: 4,
  //       token: contracts.erc1155Simple.address,
  //       tokenId: 501001,
  //       amount: 1000,
  //     },
  //     period: 1 * 84600,
  //     penalty: 0,
  //     recurrent: true,
  //     active: true,
  //   },
  // ]);
  // await blockAwait(3);
  const tx = await contracts.contractManager.addFactory(stakingInstance.address, MINTER_ROLE);
  console.info("addFactory staking, tx", tx.hash);
}
