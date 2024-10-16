import type { IBlockChainAssetTemplateDto } from "../../../exchange";
import { IBlockChainAssetTokenDto } from "../../../exchange";

export interface IClaimTemplateRowDto extends IBlockChainAssetTemplateDto {
  id?: string;
  account: string;
  endTimestamp: string;
}

export interface IClaimTemplateUploadDto {
  claims: Array<IClaimTemplateRowDto>;
}

export interface IClaimTokenRowDto extends IBlockChainAssetTokenDto {
  id?: string;
  account: string;
  endTimestamp: string;
}

export interface IClaimTokenUploadDto {
  claims: Array<IClaimTokenRowDto>;
}
