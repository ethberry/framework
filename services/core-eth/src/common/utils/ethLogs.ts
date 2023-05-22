import { providers, utils } from "ethers";
import { Log, TransactionReceipt } from "@ethersproject/abstract-provider";
import { ILogEvent } from "@gemunion/nestjs-ethers";

export const getTransactionReceipt = async function (
  txHash: string,
  provider: providers.JsonRpcProvider,
): Promise<TransactionReceipt> {
  return await provider.getTransactionReceipt(txHash);
};

export const getTransactionLog = async function (
  txHash: string,
  provider: providers.JsonRpcProvider,
  address?: string,
): Promise<Array<Log>> {
  const tx = await getTransactionReceipt(txHash, provider);
  return address ? tx.logs.filter(log => log.address.toLowerCase() === address.toLowerCase()) : tx.logs;
};

export const getTransactionEvent = async function (
  txHash: string,
  address: string,
  abi: string | string[],
  provider: providers.JsonRpcProvider,
): Promise<Array<ILogEvent>> {
  const tx = await getTransactionReceipt(txHash, provider);
  const contractLogs = tx.logs.filter(log => log.address.toLowerCase() === address.toLowerCase());
  const logsData = contractLogs.map(log => ({ topics: log.topics, data: log.data }));
  const iface = new utils.Interface(abi);
  return logsData.map(log => iface.parseLog(log));
};
