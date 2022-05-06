import { ethers } from "ethers";

export const blockAwait = async function (
  blockDelay = 2,
  provider: ethers.providers.WebSocketProvider,
): Promise<number> {
  return new Promise(resolve => {
    let initialBlockNumber = 0;
    provider.on("block", (blockNumber: number) => {
      if (!initialBlockNumber) {
        initialBlockNumber = blockNumber;
      }
      if (blockNumber === initialBlockNumber + blockDelay) {
        resolve(blockNumber);
      }
    });
  });
};
