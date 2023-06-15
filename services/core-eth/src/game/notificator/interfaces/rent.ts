import { IAssetItem } from "@framework/types";

export interface IRentData {
  from: string;
  to: string;
  expires: string;
  externalId: string;
  item: IAssetItem;
  price: Array<IAssetItem>;
}

export interface IRentUserUpdateData {
  tokenId: string;
  user: string;
  expires: string;
}
