import { ethers } from "hardhat";

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const blockAwait = async function (blockDelay = 2, delayMs?: number): Promise<void> {
  await delay(delayMs || 0);
  const initialBlock = await ethers.provider.getBlock("latest");
  let currentBlock;
  let delayB;
  do {
    await delay(delayMs || 0);
    currentBlock = await ethers.provider.getBlock("latest");
    delayB = currentBlock.number - initialBlock.number;
  } while (delayB < blockDelay);
};

export const blockAwait2 = async function (msecDelay = 5000): Promise<void> {
  await delay(msecDelay);
};
