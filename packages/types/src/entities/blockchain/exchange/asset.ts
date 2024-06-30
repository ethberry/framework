import type { IIdBase } from "@gemunion/types-collection";

import type { IAssetComponent } from "./asset-component";

export interface IAsset extends IIdBase {
  components: Array<IAssetComponent>;
}

export interface IBlockchainAsset {
  tokenType: number;
  token: string;
  tokenId: number;
  amount: number;
}
