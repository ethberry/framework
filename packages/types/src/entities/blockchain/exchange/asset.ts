import type { IIdBase } from "@gemunion/types-collection";

import type { IAssetComponent } from "./asset-component";
import { IAssetComponentHistory } from "./asset-component-history";

export interface IAsset extends IIdBase {
  components: Array<IAssetComponent>;
}

export interface IAssetHistory extends IIdBase {
  components: Array<IAssetComponentHistory>;
}
