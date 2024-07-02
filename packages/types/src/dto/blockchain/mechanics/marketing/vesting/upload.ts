import type { IVestingContractDeployDto } from "./deploy";
import type { IBlockChainAssetTemplateDto } from "../../../exchange/asset/bc-asset";

export interface IVestingClaimRowDto extends IVestingContractDeployDto, IBlockChainAssetTemplateDto {}

export interface IVestingClaimUploadDto {
  claims: Array<IVestingClaimRowDto>;
}
