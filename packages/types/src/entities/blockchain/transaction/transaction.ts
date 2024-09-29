import type { IIdDateBase } from "@ethberry/types-collection";
import { ContractType } from "../contract-manager";

export enum TransactionStatus {
  NEW = "NEW",
  PENDING = "PENDING",
  PROCESS = "PROCESS",
  PROCESSED = "PROCESSED",
}

export interface ITransaction extends IIdDateBase {
  transactionHash: string;
  chainId: number;
  blockNumber: number;
  transactionIndex: number;
  logIndex: number;
  transactionStatus: TransactionStatus;
  contractType: ContractType;
  logData: Record<string, string | number>;
}
