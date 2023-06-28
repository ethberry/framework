import type { IBCAssetDto, IVestingContractDeployDto } from "@framework/types";

export interface IVestingClaimRow extends IVestingContractDeployDto, IBCAssetDto {}

export interface IVestingClaimUploadDto {
  claims: Array<IVestingClaimRow>;
}
