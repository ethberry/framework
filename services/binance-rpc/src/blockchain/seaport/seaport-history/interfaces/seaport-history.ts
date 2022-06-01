import { IIdBase } from "@gemunion/types-collection";

export enum SeaportEventType {
  OrderFulfilled = "OrderFulfilled",
  OrderCancelled = "OrderCancelled",
  OrderValidated = "OrderValidated",
  NonceIncremented = "NonceIncremented",
}

export enum ItemType {
  NATIVE = 0,
  ERC20 = 1,
  ERC721 = 2,
  ERC1155 = 3,
  ERC721_WITH_CRITERIA = 4,
  ERC1155_WITH_CRITERIA = 5,
}

export interface ISeaportOrderFulfilled {
  orderHash: string;
  offerer: string;
  zone: string;
  fulfiller: string;
  offer: Array<[ItemType, string, string, string]>; // item type, collection address, token id, amount
  consideration: Array<[ItemType, string, string, string, string]>; // item type, collection address, token id, amount, recepient
}

export interface ISeaportOrderCancelled {
  orderHash: string;
  offerer: string;
  zone: string;
}

export interface ISeaportOrderValidated {
  orderHash: string;
  offerer: string;
  zone: string;
}

export interface ISeaportNonceIncremented {
  newNonce: string;
  offerer: string;
}

export type TSeaportEventData =
  | ISeaportOrderFulfilled
  | ISeaportOrderCancelled
  | ISeaportOrderValidated
  | ISeaportNonceIncremented;

export interface ISeaportHistory extends IIdBase {
  address: string;
  transactionHash: string;
  eventType: SeaportEventType;
  eventData: TSeaportEventData;
}
