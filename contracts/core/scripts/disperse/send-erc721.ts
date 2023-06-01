import { deployDisperse } from "../../test/Mechanics/Disperse/shared/fixtures";
import { ethers } from "hardhat";
import { blockAwait } from "@gemunion/contracts-utils";
import { templateId } from "../../test/constants";
import { deployERC721 } from "../../test/ERC721/shared/fixtures";
import { deployJerk } from "@gemunion/contracts-mocks";

async function main() {
  const totalTransfers = 3;

  const [owner, receiver] = await ethers.getSigners();
  const contractInstance = await deployDisperse();
  await blockAwait();
  const erc721Instance = await deployERC721();
  await blockAwait();
  const nonReceiverInstance = await deployJerk();
  await blockAwait();

  for (let i = 0; i < totalTransfers + 1; i++) {
    console.info(`Minting tokenId ${i + 1}`);
    await erc721Instance.mintCommon(owner.address, templateId);
    await blockAwait();
  }
  await erc721Instance.setApprovalForAll(contractInstance.address, true);
  await blockAwait();

  const receivers = new Array(totalTransfers).fill(null).map(_ => receiver.address);
  receivers.push(nonReceiverInstance.address); // fail: non receiver
  receivers.push(receiver.address); // fail: tokenId is not exist
  const tokenIds = new Array(totalTransfers + 2).fill(null).map((_, i) => i + 1);

  // Call the function and capture the transaction response
  const tx = await contractInstance.disperseERC721(erc721Instance.address, receivers, tokenIds, {
    gasLimit: 10000000,
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
