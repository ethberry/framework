import { IAssetDto } from "../../../exchange";

export interface IClaimUpdateDto {
  chainId: number;
  account: string;
  item: IAssetDto;
  endTimestamp: string;
}
