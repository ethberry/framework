import { IIdDateBase } from "@gemunion/types-collection";

export enum AccessListEventType {
  Blacklisted = "Blacklisted",
  UnBlacklisted = "UnBlacklisted",
  Whitelisted = "Whitelisted",
  UnWhitelisted = "UnWhitelisted",
}

export interface IBlacklisted {
  account: string;
}

export interface IUnBlacklisted {
  account: string;
}

export interface IWhitelisted {
  account: string;
}

export interface IUnWhitelisted {
  account: string;
}

export type TAccessListEventData = IBlacklisted | IUnBlacklisted | IWhitelisted | IUnWhitelisted;

export interface IAccessListHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: AccessListEventType;
  eventData: TAccessListEventData;
}
