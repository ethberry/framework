import type { IIdBase } from "@ethberry/types-collection";

import type { IAssetComponent } from "./asset-component";

export interface IAsset extends IIdBase {
  components: Array<IAssetComponent>;
}
