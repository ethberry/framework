import { ethers } from "hardhat";

import { amount } from "@gemunion/contracts-constants";
import { deployContract, deployJerk } from "@gemunion/contracts-mocks";
import { blockAwait } from "@gemunion/contracts-utils";

import { tokenId } from "../../test/constants";
import { deployERC1155 } from "../../test/ERC1155/shared/fixtures";

async function main() {
  const totalTransfers = 10n;

  const [owner, receiver] = await ethers.getSigners();
  const contractInstance = await deployContract("Disperse");
  await blockAwait();
  const erc1155Instance = await deployERC1155();
  await blockAwait();
  const nonReceiverInstance = await deployJerk();
  await blockAwait();

  await erc1155Instance.mint(owner.address, tokenId, amount * totalTransfers, "0x");
  await blockAwait();
  await erc1155Instance.setApprovalForAll(await contractInstance.getAddress(), true);
  await blockAwait();

  const receivers = new Array(Number(totalTransfers)).fill(receiver.address);
  receivers.push(nonReceiverInstance.address); // fail: non receiver
  receivers.push(receiver.address); // fail: tokenId does not exist
  const tokenIds = new Array(Number(totalTransfers + 1n)).fill(tokenId);
  tokenIds.push(2); // fail: tokenId does not exist
  const amounts = new Array(Number(totalTransfers + 2n)).fill(amount);

  // Call the function and capture the transaction response
  const tx = await contractInstance.disperseERC1155(await erc1155Instance.getAddress(), receivers, tokenIds, amounts, {
    gasLimit: 100000000,
  });
  await blockAwait();

  console.info("TX HASH :::", tx?.hash);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
