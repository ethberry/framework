import type { IBlockChainAssetTemplateDto } from "../../../exchange";
import { ClaimType } from "../../../../../entities";
import { IBlockChainAssetTokenDto } from "../../../exchange";

export interface IClaimTemplateRowDto extends IBlockChainAssetTemplateDto {
  id?: string;
  account: string;
  endTimestamp: string;
}

export interface IClaimTemplateUploadDto {
  claims: Array<IClaimTemplateRowDto>;
  claimType: ClaimType;
}

export interface IClaimTokenRowDto extends IBlockChainAssetTokenDto {
  account: string;
  endTimestamp: string;
}

export interface IClaimTokenUploadDto {
  claims: Array<IClaimTokenRowDto>;
  claimType: ClaimType;
}
