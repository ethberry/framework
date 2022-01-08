import { IIdBase } from "@gemunion/types-collection";

export enum TransactionStatus {
  NEW = "NEW",
  MINED = "MINED",
  CONFIRMED = "CONFIRMED",
  ERRORED = "ERRORED",
}

export interface ITransaction extends IIdBase {
  transactionHash: string;
  blockNumber: number;
  status: TransactionStatus;
}
