import { UniTemplateStatus } from "@framework/types";

export interface IErc721TemplateUpdateDto {
  title: string;
  description: string;
  attributes: string;
  price: string;
  amount: string;
  imageUrl: string;
  templateStatus: UniTemplateStatus;
}
