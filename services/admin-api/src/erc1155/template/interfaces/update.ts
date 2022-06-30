import { UniTemplateStatus } from "@framework/types";

import { IAssetDto } from "../../../blockchain/asset/interfaces";

export interface IErc1155TemplateUpdateDto {
  title: string;
  description: string;
  attributes: string;
  imageUrl: string;
  price: IAssetDto;
  amount: string;
  templateStatus: UniTemplateStatus;
}
