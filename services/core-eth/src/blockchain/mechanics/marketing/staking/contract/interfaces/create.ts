import { DurationUnit, IAssetDto, StakingRuleStatus, TokenType } from "@framework/types";
import { ContractEntity } from "../../../../../hierarchy/contract/contract.entity";

export interface IStakingItemCreateDto {
  tokenType: TokenType;
  collection: number;
  tokenId: number;
  amount: string;
}

export interface IStakingCreateDto {
  title: string;
  description: string;
  externalId?: string;
  deposit: IAssetDto;
  reward: IAssetDto;
  durationAmount: number;
  durationUnit: DurationUnit;
  penalty: number;
  maxStake: number;
  recurrent: boolean;
  stakingRuleStatus?: StakingRuleStatus;
  contractId: number;
  contract?: ContractEntity;
}
