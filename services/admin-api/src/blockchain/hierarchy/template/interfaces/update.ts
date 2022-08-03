import { TemplateStatus } from "@framework/types";

import { IAssetDto } from "@framework/types";

export interface ITemplateUpdateDto {
  title: string;
  description: string;
  imageUrl: string;
  price: IAssetDto;
  amount: string;
  templateStatus: TemplateStatus;
}
