import { Erc998TemplateStatus } from "@framework/types";

export interface IErc998TemplateUpdateDto {
  title: string;
  description: string;
  attributes: string;
  price: string;
  amount: number;
  imageUrl: string;
  templateStatus: Erc998TemplateStatus;
}
