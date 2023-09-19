import { Interface, JsonRpcProvider, Log, LogDescription, TransactionReceipt } from "ethers";
// import { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";

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

export const getTransactionEvent = async function (
  txHash: string,
  address: string,
  abi: string | string[],
  provider: JsonRpcProvider,
): Promise<ReadonlyArray<LogDescription>> {
  const tx = await getTransactionReceipt(txHash, provider);
  if (!tx) {
    return [];
  }
  const contractLogs = tx.logs.filter(log => log.address.toLowerCase() === address.toLowerCase());
  const logsData = contractLogs.map(log => ({ topics: log.topics, data: log.data }));
  const iface = new Interface(abi);
  return logsData.map(log =>
    iface.parseLog({ topics: log.topics as string[], data: log.data }),
  ) as Array<LogDescription>;
};
