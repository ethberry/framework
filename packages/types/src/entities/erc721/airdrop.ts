import { IIdBase } from "@gemunion/types-collection";

import { IErc721Template } from "./template";
import { IErc721Token } from "./token";

export enum Erc721AirdropStatus {
  NEW = "NEW",
  REDEEMED = "REDEEMED",
  UNPACKED = "UNPACKED",
}

export interface IErc721Airdrop extends IIdBase {
  owner: string;
  erc721TemplateId: number;
  erc721Template?: IErc721Template;
  erc721TokenId: number;
  erc721Token?: IErc721Token;
  airdropStatus: Erc721AirdropStatus;
  signature: string;
}
