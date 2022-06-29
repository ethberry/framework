import { UniTemplateStatus } from "@framework/types";

import { IAssetDto } from "../../../blockchain/asset/interfaces";

export interface IUniTemplateUpdateDto {
  title: string;
  description: string;
  attributes: string;
  price: IAssetDto;
  amount: number;
  imageUrl: string;
  templateStatus: UniTemplateStatus;
}
