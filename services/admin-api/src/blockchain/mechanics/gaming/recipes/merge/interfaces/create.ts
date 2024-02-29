import { IAssetDto, MergeStatus } from "@framework/types";

export interface IMergeCreateDto {
  item: IAssetDto;
  price: IAssetDto;
  mergeStatus?: MergeStatus;
}
