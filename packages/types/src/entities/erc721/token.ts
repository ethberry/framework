import { IIdBase } from "@gemunion/types-collection";

import { IErc721Template } from "./template";
import { IErc721TokenHistory } from "./token-history";
import { IErc721Dropbox } from "./dropbox";

export enum Erc721TokenStatus {
  MINTED = "MINTED",
  BURNED = "BURNED",
}

export enum TokenRarity {
  UNKNOWN = "UNKNOWN",
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

export interface IErc721Token extends IIdBase {
  attributes: any;
  rarity: TokenRarity;
  tokenId: string;
  tokenStatus: Erc721TokenStatus;
  owner: string;
  erc721TemplateId: number | null;
  erc721Template?: IErc721Template;
  erc721DropboxId: number | null;
  erc721Dropbox?: IErc721Dropbox;
  erc721TokenId: number | null;
  erc721Token?: IErc721Token;
  history?: Array<IErc721TokenHistory>;
}
