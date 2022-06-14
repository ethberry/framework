import { IIdDateBase } from "@gemunion/types-collection";

import { IErc998Template } from "./template";
import { IErc998TokenHistory } from "./token-history";
import { IErc998Dropbox } from "./dropbox";
import { TokenRarity } from "../blockchain/common";

export enum Erc998TokenStatus {
  MINTED = "MINTED",
  BURNED = "BURNED",
}

export interface IErc998Token extends IIdDateBase {
  attributes: any;
  rarity: TokenRarity;
  tokenId: string;
  tokenStatus: Erc998TokenStatus;
  owner: string;
  erc998TemplateId: number | null;
  erc998Template?: IErc998Template;
  erc998DropboxId: number | null;
  erc998Dropbox?: IErc998Dropbox;
  erc998TokenId: number | null;
  erc998Token?: IErc998Token;
  history?: Array<IErc998TokenHistory>;
}
