import { amount } from "@gemunion/contracts-constants";
import { deployDisperse } from "../../test/Mechanics/Disperse/shared/fixtures";
import { ethers } from "hardhat";
import { tokenId } from "../../test/constants";
import { deployERC1155 } from "../../test/ERC1155/shared/fixtures";
import { deployJerk } from "@gemunion/contracts-mocks";
import { blockAwait } from "@gemunion/contracts-utils";

async function main() {
  const totalTransfers = 10;

  const [owner, receiver] = await ethers.getSigners();
  const contractInstance = await deployDisperse();
  await blockAwait();
  const erc1155Instance = await deployERC1155();
  await blockAwait();
  const nonReceiverInstance = await deployJerk();
  await blockAwait();

  await erc1155Instance.mint(owner.address, tokenId, amount * totalTransfers, "0x");
  await blockAwait();
  await erc1155Instance.setApprovalForAll(contractInstance.address, true);
  await blockAwait();

  const receivers = new Array(totalTransfers).fill(receiver.address);
  receivers.push(nonReceiverInstance.address); // fail: non receiver
  receivers.push(receiver.address); // fail: tokenId does not exist
  const tokenIds = new Array(totalTransfers + 1).fill(tokenId);
  tokenIds.push(2); // fail: tokenId does not exist
  const amounts = new Array(totalTransfers + 2).fill(amount);

  // Call the function and capture the transaction response
  const tx = await contractInstance.disperseERC1155(erc1155Instance.address, receivers, tokenIds, amounts, {
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
