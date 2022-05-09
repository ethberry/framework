import { IIdBase } from "@gemunion/types-collection";

import { IErc721Collection } from "./collection";
import { IErc721Airdrop } from "./airdrop";
import { IErc721Token } from "./token";

export enum Erc721TemplateStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IErc721Template extends IIdBase {
  title: string;
  description: string;
  imageUrl: string;
  attributes: any;
  price: string;
  amount: number;
  templateStatus: Erc721TemplateStatus;
  erc721CollectionId: number;
  erc721Collection?: IErc721Collection;
  erc721Tokens?: Array<IErc721Token>;
  erc721Airdrops?: Array<IErc721Airdrop>;
}
