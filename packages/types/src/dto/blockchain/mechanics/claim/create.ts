import type { IAssetDto } from "../../exchange/asset/asset";
import { ClaimType } from "../../../../entities";

export interface IClaimCreateDto {
  chainId: number;
  account: string;
  item: IAssetDto;
  endTimestamp: string;
  claimType: ClaimType;
}
