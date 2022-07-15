import { IIdBase } from "@gemunion/types-collection";

import { IAssetComponent } from "./asset-component";

export enum AssetType {
  "TEMPLATE" = "TEMPLATE",
  "AIRDROP" = "AIRDROP",
  "LOOTBOX" = "LOOTBOX",
  "EXCHANGE" = "EXCHANGE",
  "STAKING" = "STAKING",
}

export interface IAsset extends IIdBase {
  components: Array<IAssetComponent>;
  assetType: AssetType;
  externalId: string;
}
