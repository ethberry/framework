import type { IAssetItem } from "./common";

// event Upgrade(address account, uint256 externalId, Asset item, Asset[] price, bytes32 attribute, uint256 level);
export interface IExchangeGradeEvent {
  account: string;
  externalId: string;
  item: IAssetItem;
  price: Array<IAssetItem>;
  attribute: string;
  level: string;
}
