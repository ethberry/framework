import { TemplateStatus } from "@framework/types";

import { IAssetDto } from "../../../../mechanics/asset/interfaces";

export interface ITemplateUpdateDto {
  title: string;
  description: string;
  attributes: string;
  imageUrl: string;
  price: IAssetDto;
  amount: string;
  templateStatus: TemplateStatus;
}
