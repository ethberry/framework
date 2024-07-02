import type { IBlockChainAssetTemplateDto, IVestingContractDeployDto } from "@framework/types";

export interface IVestingClaimRow extends IVestingContractDeployDto, IBlockChainAssetTemplateDto {}

export interface IVestingClaimUploadDto {
  claims: Array<IVestingClaimRow>;
}
