import { IAssetDto, TemplateStatus } from "@framework/types";

export interface ITemplateCreateDto {
  title: string;
  description: string;
  price?: IAssetDto;
  amount?: string;
  cap: string;
  imageUrl: string;
  contractId: number;
  templateStatus: TemplateStatus;
}
