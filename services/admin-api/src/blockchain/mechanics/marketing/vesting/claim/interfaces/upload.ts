import type { IBCAssetTemplateDto, IVestingContractDeployDto } from "@framework/types";

export interface IVestingClaimRow extends IVestingContractDeployDto, IBCAssetTemplateDto {}

export interface IVestingClaimUploadDto {
  claims: Array<IVestingClaimRow>;
}
