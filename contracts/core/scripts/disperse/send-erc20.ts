import { ethers } from "hardhat";

import { deployContract } from "@gemunion/contracts-mocks";
import { amount } from "@gemunion/contracts-constants";

import { deployERC20 } from "../../test/ERC20/shared/fixtures";

async function main() {
  const totalTransfers = 10n;

  const [owner, receiver] = await ethers.getSigners();
  const contractInstance = await deployContract("Disperse");
  const erc20Instance = await deployERC20();

  await erc20Instance.mint(owner.address, amount);
  await erc20Instance.approve(await contractInstance.getAddress(), amount);

  const receivers = new Array(Number(totalTransfers)).fill(null).map(_ => receiver.address);
  const amounts = new Array(Number(totalTransfers)).fill(null).map(_ => amount / totalTransfers);

  // Call the function and capture the transaction response
  const tx = await contractInstance.disperseERC20(await erc20Instance.getAddress(), receivers, amounts, {
    gasLimit: 10000000,
  });

  console.info("TX HASH :::", tx?.hash);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
