import { IVestingContractDeployDto } from "./deploy";
import { IBCAssetTemplateDto } from "../../exchange/asset/bc-asset";

export interface IVestingClaimRowDto extends IVestingContractDeployDto, IBCAssetTemplateDto {}

export interface IVestingClaimUploadDto {
  claims: Array<IVestingClaimRowDto>;
}
