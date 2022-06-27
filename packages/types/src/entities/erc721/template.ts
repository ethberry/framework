import { IIdDateBase } from "@gemunion/types-collection";

import { IErc721Collection } from "./collection";
import { IErc721Airdrop } from "./airdrop";
import { IErc721Token } from "./token";
import { IErc20Token } from "../erc20/token";

export enum Erc721TemplateStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IErc721Template extends IIdDateBase {
  title: string;
  description: string;
  imageUrl: string;
  attributes: any;
  price: string;
  amount: number;
  templateStatus: Erc721TemplateStatus;
  erc20TokenId: number;
  erc20Token?: IErc20Token;
  erc721CollectionId: number;
  erc721Collection?: IErc721Collection;
  erc721Tokens?: Array<IErc721Token>;
  erc721Airdrops?: Array<IErc721Airdrop>;
}
