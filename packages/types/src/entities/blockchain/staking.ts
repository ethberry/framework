import { ISearchable, IIdBase } from "@gemunion/types-collection";
import { TokenType } from "./common";
import { IStakingTokenData } from "./staking-history";

export enum StakingStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IStakingItem extends IIdBase {
  tokenType: TokenType;
  collection: string;
  tokenData: IStakingTokenData;
  amount: string;
}

// struct Item {
//   ItemType itemType;
//   address token;
//   TokenData tokenData;
//   uint256 amount;
// }

export interface IStaking extends ISearchable {
  deposit: IStakingItem;
  reward: IStakingItem;
  duration: number;
  penalty: number;
  recurrent: boolean;
  stakingStatus: StakingStatus;
}
