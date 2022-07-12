import { IIdDateBase } from "@gemunion/types-collection";
import { IAsset } from "../blockchain/asset";

export enum MarketplaceEventType {
  RedeemCommon = "RedeemCommon",
  RedeemDropbox = "RedeemDropbox",
}

export interface IMarketplaceRedeemCommon {
  from: string;
  item: IAsset;
  price: IAsset;
}

export interface IMarketplaceRedeemDropbox {
  from: string;
  item: IAsset;
  price: IAsset;
}

export type TMarketplaceEventData = IMarketplaceRedeemCommon | IMarketplaceRedeemDropbox;

export interface IMarketplaceHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: MarketplaceEventType;
  eventData: TMarketplaceEventData;
}
