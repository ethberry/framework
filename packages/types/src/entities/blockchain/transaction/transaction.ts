import type { IIdDateBase } from "@gemunion/types-collection";

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
  logData: Record<string, string | number>;
}
