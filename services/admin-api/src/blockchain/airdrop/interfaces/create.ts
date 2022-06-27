import { IAssetDto } from "../../../uni-token/interfaces";

export interface IAirdropItem {
  account: string;
  item: IAssetDto;
}

export interface IAirdropCreateDto {
  list: Array<IAirdropItem>;
}
