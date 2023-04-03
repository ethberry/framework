import { IAssetDto } from "@framework/types";

export interface IRentUpdateDto {
  contractId: number;
  price: IAssetDto;
}
