import { IIdDateBase } from "@gemunion/types-collection";

import { IErc998Collection } from "./collection";
import { IErc998Airdrop } from "./airdrop";
import { IErc998Token } from "./token";

export enum Erc998TemplateStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IErc998Template extends IIdDateBase {
  title: string;
  description: string;
  imageUrl: string;
  attributes: any;
  price: string;
  amount: number;
  templateStatus: Erc998TemplateStatus;
  erc998CollectionId: number;
  erc998Collection?: IErc998Collection;
  erc998Tokens?: Array<IErc998Token>;
  erc998Airdrops?: Array<IErc998Airdrop>;
}
