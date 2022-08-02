import { IAssetDto } from "@framework/types";

export interface IClaimItemCreateDto {
  account: string;
  item: IAssetDto;
}
