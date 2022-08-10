import { IAssetDto } from "../../asset/interfaces";

export interface IClaimItemCreateDto {
  account: string;
  item: IAssetDto;
}
