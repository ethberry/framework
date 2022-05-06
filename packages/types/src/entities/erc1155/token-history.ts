import { IIdBase } from "@gemunion/types-collection";

export enum Erc1155TokenEventType {
  TransferSingle = "TransferSingle",
  TransferBatch = "TransferBatch",
  ApprovalForAll = "ApprovalForAll",
  URI = "URI",
}

export interface IErc1155TokenTransferSingle {
  operator: string;
  from: string;
  to: string;
  id: string;
  value: string;
}

export interface IErc1155TokenTransferBatch {
  operator: string;
  from: string;
  to: string;
  ids: Array<string>;
  values: Array<string>;
}

export interface IErc1155TokenApprovalForAll {
  account: string;
  operator: string;
  approved: boolean;
}

export interface IErc1155TokenUri {
  value: string;
  id: string;
}

export type TErc1155TokenEventData =
  | IErc1155TokenTransferSingle
  | IErc1155TokenTransferBatch
  | IErc1155TokenApprovalForAll
  | IErc1155TokenUri;

export interface IErc1155TokenHistory extends IIdBase {
  address: string;
  transactionHash: string;
  eventType: Erc1155TokenEventType;
  eventData: TErc1155TokenEventData;
}
