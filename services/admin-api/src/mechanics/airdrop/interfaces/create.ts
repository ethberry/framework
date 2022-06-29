import { IAssetDto } from "../../../blockchain/asset/interfaces";

export interface IAirdropItem {
  account: string;
  item: IAssetDto;
}

export interface IAirdropCreateDto {
  list: Array<IAirdropItem>;
}
