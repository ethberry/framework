import type { IIdBase } from "@gemunion/types-collection";

import { IAssetComponent } from "./asset-component";

export interface IAsset extends IIdBase {
  components: Array<IAssetComponent>;
}
