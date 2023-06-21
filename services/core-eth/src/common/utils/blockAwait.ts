import { ethers } from "ethers";

export const blockAwait = async function (blockDelay = 1, provider: ethers.JsonRpcProvider): Promise<number> {
  return new Promise(resolve => {
    let initialBlockNumber = 0;
    void provider.on("block", (blockNumber: number) => {
      if (!initialBlockNumber) {
        initialBlockNumber = blockNumber;
      }
      if (blockNumber === initialBlockNumber + blockDelay) {
        resolve(blockNumber);
      }
    });
  });
};
