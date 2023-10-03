import type { IVestingContractDeployDto } from "./deploy";
import type { IBCAssetTemplateDto } from "../../exchange/asset/bc-asset";

export interface IVestingClaimRowDto extends IVestingContractDeployDto, IBCAssetTemplateDto {}

export interface IVestingClaimUploadDto {
  claims: Array<IVestingClaimRowDto>;
}
