import type { IAssetDto } from "../../../exchange";
import { ClaimType } from "../../../../../entities";

export interface IClaimCreateDto {
  chainId: number;
  account: string;
  item: IAssetDto;
  endTimestamp: string;
  claimType: ClaimType;
}
