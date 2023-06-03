import { ethers } from "hardhat";

import { amount } from "@gemunion/contracts-constants";
import { blockAwait } from "@gemunion/contracts-utils";
import { deployContract } from "@gemunion/contracts-mocks";

async function main() {
  const totalTransfers = 10;

  const [_, receiver] = await ethers.getSigners();
  const contractInstance = await deployContract("Disperse");
  await blockAwait();
  await blockAwait();

  const receivers = new Array(totalTransfers + 1).fill(null).map(_ => receiver.address);
  const amounts = new Array(totalTransfers + 1).fill(null).map(_ => amount);

  // Call the function and capture the transaction response
  const tx = await contractInstance.disperseEther(receivers, amounts, { value: amount * (totalTransfers + 1) });
  await blockAwait();

  console.info("TX HASH :::", tx?.hash);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
