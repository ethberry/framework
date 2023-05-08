import { IAssetComponentHistory } from "./asset-component-history";
import { IIdBase } from "@gemunion/types-collection/dist/base";

export interface IAssetHistory extends IIdBase {
  components: Array<IAssetComponentHistory>;
}
