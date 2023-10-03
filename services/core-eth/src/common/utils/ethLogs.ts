import { Interface, JsonRpcProvider, Log, LogDescription, TransactionReceipt, keccak256, toUtf8Bytes } from "ethers";

import {
  AccessControlEventType,
  AccessListEventType,
  ContractEventSignature,
  ContractEventType,
  Erc4907EventType,
  ExchangeEventType,
  LotteryEventType,
  RaffleEventType,
  ContractManagerEventType,
  ReferralProgramEventType,
  Erc1363EventType,
  StakingEventType,
  VestingEventType,
  WaitListEventType,
  PonziEventType,
} from "@framework/types";
// import { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";

export const keccak256It = function (value: string): string {
  return keccak256(toUtf8Bytes(value));
};

export const getEventsTopics = function (
  events: Array<
    | ContractEventType
    | AccessControlEventType
    | Erc4907EventType
    | LotteryEventType
    | RaffleEventType
    | ExchangeEventType
    | AccessListEventType
    | ContractManagerEventType
    | ReferralProgramEventType
    | Erc1363EventType
    | StakingEventType
    | VestingEventType
    | WaitListEventType
    | PonziEventType
  >,
): [Array<string>] {
  return [
    events.map(event => {
      if (Object.keys(ContractEventSignature).some(v => v === event.toString())) {
        return keccak256It(Object.values(ContractEventSignature)[Object.keys(ContractEventSignature).indexOf(event)]);
      } else {
        throw new Error(`Missing event signature: ${event}`);
        // return "";
      }
    }),
  ];
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
