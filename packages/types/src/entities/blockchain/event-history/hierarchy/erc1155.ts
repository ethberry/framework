export interface IErc1155TokenTransferSingleEvent {
  operator: string;
  from: string;
  to: string;
  id: string;
  value: string;
}

export interface IErc1155TokenTransferBatchEvent {
  operator: string;
  from: string;
  to: string;
  ids: Array<string>;
  values: Array<string>;
}

export interface IErc1155TokenApprovalForAllEvent {
  account: string;
  operator: string;
  approved: boolean;
}

export interface IErc1155TokenUriEvent {
  value: string;
  id: string;
}

export type TErc1155Events =
  | IErc1155TokenTransferSingleEvent
  | IErc1155TokenTransferBatchEvent
  | IErc1155TokenApprovalForAllEvent
  | IErc1155TokenUriEvent;
