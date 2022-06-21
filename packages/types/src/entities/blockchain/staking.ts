import { ISearchable, IIdBase } from "@gemunion/types-collection";
import { TokenType } from "./common";
import { IErc20Token } from "../erc20/token";
import { IErc721Collection } from "../erc721/collection";
import { IErc998Collection } from "../erc998/collection";
import { IErc1155Collection } from "../erc1155/collection";

export enum StakingStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IStakingItem extends IIdBase {
  tokenType: TokenType;
  collection: number;
  tokenId: number;
  amount: string;
  stakingId: number;
  erc20?: IErc20Token;
  erc721?: IErc721Collection;
  erc998?: IErc998Collection;
  erc1155?: IErc1155Collection;
}

export interface IStaking extends ISearchable {
  deposit: IStakingItem;
  reward: IStakingItem;
  duration: number;
  penalty: number;
  recurrent: boolean;
  stakingStatus: StakingStatus;
}
