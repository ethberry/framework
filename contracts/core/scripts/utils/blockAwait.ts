import { ethers } from "hardhat";

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const blockAwait = async function (blockDelay = 2): Promise<void> {
  const initialBlock = await ethers.provider.getBlock("latest");
  console.info("initialBlock:", initialBlock.number);
  let currentBlock;
  let delayB;
  do {
    await delay(5000);
    currentBlock = await ethers.provider.getBlock("latest");
    delayB = currentBlock.number - initialBlock.number;
    console.info("delay is:", delayB);
  } while (delayB < blockDelay);
};
