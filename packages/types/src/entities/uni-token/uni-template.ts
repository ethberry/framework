import { ISearchable } from "@gemunion/types-collection";

import { IAsset } from "../blockchain/asset";
import { IUniContract } from "./uni-contract";
import { IUniToken } from "./uni-token";

export enum UniTemplateStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IUniTemplate extends ISearchable {
  imageUrl: string;
  attributes: any;
  price: IAsset;
  priceId: number;
  amount: number;
  templateStatus: UniTemplateStatus;
  uniContractId: number;
  uniContract?: IUniContract;
  uniTokens?: Array<IUniToken>;
}
