import { IAssetDto } from "../../asset/interfaces";

export interface IDropCreateDto {
  item: IAssetDto;
  price: IAssetDto;
  startTimestamp: string;
  endTimestamp: string;
}
