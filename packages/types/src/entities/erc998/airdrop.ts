import { IIdDateBase } from "@gemunion/types-collection";

import { IErc998Template } from "./template";
import { IErc998Token } from "./token";

export enum Erc998AirdropStatus {
  NEW = "NEW",
  REDEEMED = "REDEEMED",
  UNPACKED = "UNPACKED",
}

export interface IErc998Airdrop extends IIdDateBase {
  owner: string;
  erc998TemplateId: number;
  erc998Template?: IErc998Template;
  erc998TokenId: number;
  erc998Token?: IErc998Token;
  airdropStatus: Erc998AirdropStatus;
  signature: string;
}
