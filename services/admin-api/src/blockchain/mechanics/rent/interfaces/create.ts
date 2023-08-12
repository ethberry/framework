import { IAssetDto } from "@framework/types";

export interface IRentCreateDto {
  title: string;
  contractId: number;
  price: IAssetDto;
}
