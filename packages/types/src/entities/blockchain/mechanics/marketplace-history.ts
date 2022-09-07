import type { IIdDateBase } from "@gemunion/types-collection";
import { IAsset } from "./asset";

export enum MarketplaceEventType {
  RedeemCommon = "RedeemCommon",
  RedeemMysterybox = "RedeemMysterybox",
}

export interface IMarketplaceRedeemCommon {
  from: string;
  item: IAsset;
  price: IAsset;
}

export interface IMarketplaceRedeemMysterybox {
  from: string;
  item: IAsset;
  price: IAsset;
}

export type TMarketplaceEventData = IMarketplaceRedeemCommon | IMarketplaceRedeemMysterybox;

export interface IMarketplaceHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: MarketplaceEventType;
  eventData: TMarketplaceEventData;
}
