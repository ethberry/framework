export enum AccessListEventType {
  Blacklisted = "Blacklisted",
  UnBlacklisted = "UnBlacklisted",
  Whitelisted = "Whitelisted",
  UnWhitelisted = "UnWhitelisted",
}

export enum AccessListEventSignature {
  Blacklisted = "Blacklisted(address)",
  UnBlacklisted = "UnBlacklisted(address)",
  Whitelisted = "Whitelisted(address)",
  UnWhitelisted = "UnWhitelisted(address)",
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

export type TAccessListEvents = IBlacklistedEvent | IUnBlacklistedEvent | IWhitelistedEvent | IUnWhitelistedEvent;
