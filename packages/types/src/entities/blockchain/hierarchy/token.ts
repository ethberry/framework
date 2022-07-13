import { IIdDateBase } from "@gemunion/types-collection";

import { ITemplate } from "./template";
import { IBalance } from "./balance";

export enum TokenStatus {
  MINTED = "MINTED",
  BURNED = "BURNED",
}

export interface IToken extends IIdDateBase {
  attributes: any;
  tokenId: string;
  royalty: number;
  tokenStatus: TokenStatus;
  templateId: number | null;
  template?: ITemplate;
  balance?: Array<IBalance>;
}
