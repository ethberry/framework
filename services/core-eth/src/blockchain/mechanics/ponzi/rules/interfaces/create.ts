import { DurationUnit, IAssetDto, PonziRuleStatus, StakingRuleStatus, TokenType } from "@framework/types";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";

// export interface IPonziItemCreateDto {
//   tokenType: TokenType;
//   collection: number;
//   tokenId: number;
//   amount: string;
// }

export interface IPonziCreateDto {
  title: string;
  externalId?: string;
  deposit: IAssetDto;
  reward: IAssetDto;
  durationAmount: number;
  durationUnit: DurationUnit;
  penalty: number;
  maxCycles: number;
  ponziRuleStatus?: PonziRuleStatus;
  contractId: number;
  contract?: ContractEntity;
}
