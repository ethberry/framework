import { IIdDateBase } from "@gemunion/types-collection";

import { IUniTemplate } from "./uni-template";

export enum UniTokenStatus {
  MINTED = "MINTED",
  BURNED = "BURNED",
}

export interface IUniToken extends IIdDateBase {
  attributes: any;
  tokenId: string;
  royalty: number;
  tokenStatus: UniTokenStatus;
  uniTemplateId: number | null;
  uniTemplate?: IUniTemplate;
}
