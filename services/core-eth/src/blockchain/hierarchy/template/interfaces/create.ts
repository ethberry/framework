import { IAssetDto, TemplateStatus } from "@framework/types";

export interface ITemplateCreateDto {
  title: string;
  description: string;
  price?: IAssetDto;
  amount?: bigint;
  cap: bigint;
  imageUrl: string;
  contractId: number;
  templateStatus: TemplateStatus;
}
