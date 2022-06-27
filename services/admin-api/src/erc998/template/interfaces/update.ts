import { UniTemplateStatus } from "@framework/types";

import { IAssetDto } from "../../../uni-token/interfaces";

export interface IErc998TemplateUpdateDto {
  title: string;
  description: string;
  attributes: string;
  price: IAssetDto;
  amount: number;
  imageUrl: string;
  templateStatus: UniTemplateStatus;
}
