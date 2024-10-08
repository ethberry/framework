import type { IDeployable } from "@ethberry/types-blockchain";

import type { IAssetComponentHistory } from "../exchange/asset-component-history";
import type { IToken } from "../hierarchy/token";
import type { IContract } from "../hierarchy/contract";

import type { ContractManagerEventType, TContractManagerEvent } from "./contract-manager";
import type { ExchangeEventType, TExchangeEvents } from "./exchange";
import type { TExchangeEventData, TExtensionEventType } from "./extensions";
import type { THierarchyEventData, THierarchyEventType } from "./hierarchy";
import type { TIntegrationEventData, TIntegrationEventType } from "./integrations";
import type { TMechanicsEventData, TMechanicsEventType } from "./mechanics";

export type TContractEventType =
  | ContractManagerEventType
  | ExchangeEventType
  | TExtensionEventType
  | THierarchyEventType
  | TIntegrationEventType
  | TMechanicsEventType;

export type TContractEventData =
  | TContractManagerEvent
  | TExchangeEvents
  | TExchangeEventData
  | THierarchyEventData
  | TIntegrationEventData
  | TMechanicsEventData;

export interface IEventHistory extends IDeployable {
  transactionHash: string;
  eventType: TContractEventType;
  eventData: TContractEventData;
  contractId: number | null;
  contract?: IContract;
  tokenId: number | null;
  token?: IToken;
  parentId: number | null;
  parent?: IEventHistory;
  assets?: Array<IAssetComponentHistory>;
}

export interface IMarketplaceReport extends IEventHistory {
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
}
