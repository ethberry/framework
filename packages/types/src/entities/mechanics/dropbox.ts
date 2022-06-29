import { ISearchable } from "@gemunion/types-collection";

import { IUniContract } from "../uni-token/uni-contract";
import { IUniTemplate } from "../uni-token/uni-template";
import { IAsset } from "../blockchain/asset";

export enum DropboxStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IDropbox extends ISearchable {
  imageUrl: string;
  price: IAsset;
  item: IAsset;
  dropboxStatus: DropboxStatus;
  uniTemplateId: number;
  uniTemplate?: IUniTemplate;
  uniContractId: number;
  uniContract?: IUniContract;
}
