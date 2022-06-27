import { ISearchable } from "@gemunion/types-collection";

import { IUniContract } from "../uni-token/uni-contract";
import { IAsset } from "./asset";

export enum DropboxStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IDropbox extends ISearchable {
  imageUrl: string;
  price: IAsset;
  item: IAsset;
  dropboxStatus: DropboxStatus;
  uniContractId: number;
  uniContract?: IUniContract;
}
