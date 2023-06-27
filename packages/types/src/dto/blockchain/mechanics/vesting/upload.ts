import { IVestingContractDeployDto } from "./deploy";
import { IBCAssetDto } from "../../exchange/asset/bc-asset";

export interface IVestingClaimRowDto extends IVestingContractDeployDto, IBCAssetDto {}

export interface IVestingClaimUploadDto {
  claims: Array<IVestingClaimRowDto>;
}
