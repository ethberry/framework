import { JsonRpcProvider, keccak256, Log, toUtf8Bytes, TransactionReceipt } from "ethers";

export const keccak256It = function (value: string): string {
  return keccak256(toUtf8Bytes(value));
};

export const delayMs = function (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getBlockNumber = async function (provider: JsonRpcProvider): Promise<number> {
  return provider.getBlockNumber();
};

export const getTransactionReceipt = async function (
  txHash: string,
  provider: JsonRpcProvider,
): Promise<TransactionReceipt | null> {
  return provider.getTransactionReceipt(txHash);
};

export const getTransactionLog = async function (
  txHash: string,
  provider: JsonRpcProvider,
  address?: string,
): Promise<ReadonlyArray<Log>> {
  const tx = await getTransactionReceipt(txHash, provider);
  if (!tx) {
    return [];
  }
  return address ? tx.logs.filter(log => log.address.toLowerCase() === address.toLowerCase()) : tx.logs;
};
