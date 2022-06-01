import { IIdBase } from "@gemunion/types-collection";

export enum SeaportEventType {
  OrderFulfilled = "OrderFulfilled",
  OrderCancelled = "OrderCancelled",
  OrderValidated = "OrderValidated",
  NonceIncremented = "NonceIncremented",
}

export interface ISeaportOrderFulfilled {}

export interface ISeaportOrderCancelled {}

export interface ISeaportOrderValidated {}

export interface ISeaportNonceIncremented {}

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
