import { IIdDateBase } from "@gemunion/types-collection";

import { IAssetComponent } from "./asset-component";

export enum AssetType {
  "MARKETPLACE" = "MARKETPLACE",
  "EXCHANGE" = "EXCHANGE",
  "STAKING" = "STAKING",
}

export interface IAsset extends IIdDateBase {
  components: Array<IAssetComponent>;
  assetType: AssetType;
  externalId: number;
}
