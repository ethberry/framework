import { ISearchable } from "@gemunion/types-collection";

import { IContract } from "../hierarchy/contract";
import { ITemplate } from "../hierarchy/template";
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
  templateId: number;
  template?: ITemplate;
  contractId: number;
  contract?: IContract;
}
