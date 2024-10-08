import { AccessControlEventType, TAccessControlEvents } from "./access-control";
import { AccessListEventType, TAccessListEvents } from "./access-list";
import { BaseUrlEventType, TBaseURIEvents } from "./base-uri";
import { Erc4906EventType, TErc4906Events } from "./erc4906";
import { PausableEventType, TPausableEvents } from "./pausable";
import { RoyaltyEventType, TRoyaltyEvents } from "./royalty";

export * from "./access-control";
export * from "./access-list";
export * from "./base-uri";
export * from "./erc4906";
export * from "./pausable";
export * from "./royalty";

export type TExtensionEventType =
  | AccessControlEventType
  | AccessListEventType
  | PausableEventType
  | RoyaltyEventType
  | BaseUrlEventType
  | Erc4906EventType;

export type TExchangeEventData =
  | TRoyaltyEvents
  | TPausableEvents
  | TAccessControlEvents
  | TAccessListEvents
  | TBaseURIEvents
  | TErc4906Events;
