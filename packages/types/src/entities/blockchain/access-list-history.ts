import type { IIdDateBase } from "@gemunion/types-collection";

export enum AccessListEventType {
  Blacklisted = "Blacklisted",
  UnBlacklisted = "UnBlacklisted",
  Whitelisted = "Whitelisted",
  UnWhitelisted = "UnWhitelisted",
}

export interface IBlacklistedEvent {
  account: string;
}

export interface IUnBlacklistedEvent {
  account: string;
}

export interface IWhitelistedEvent {
  account: string;
}

export interface IUnWhitelistedEvent {
  account: string;
}

export type TAccessListEventData = IBlacklistedEvent | IUnBlacklistedEvent | IWhitelistedEvent | IUnWhitelistedEvent;

export interface IAccessListHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: AccessListEventType;
  eventData: TAccessListEventData;
}
