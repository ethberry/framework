import { IAssetDto } from "@framework/types";

export interface IClaimItemUpdateDto {
  account: string;
  item: IAssetDto;
  endTimestamp: string;
}
