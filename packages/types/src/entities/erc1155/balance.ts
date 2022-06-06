import { BigNumber } from "ethers";
import { IIdDateBase } from "@gemunion/types-collection";

import { IErc1155Token } from "./token";

export interface IErc1155Balance extends IIdDateBase {
  wallet: string;
  amount: BigNumber;
  erc1155TokenId: number;
  erc1155Token?: IErc1155Token;
}
