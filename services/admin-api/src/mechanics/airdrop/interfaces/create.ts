import { IAssetDto } from "../../../blockchain/asset/interfaces";

export interface IAirdropItem {
  account: string;
  item: IAssetDto;
}

export interface IAirdropSign {
  account: string;
  airdropId: number;
  templateId: number;
}
