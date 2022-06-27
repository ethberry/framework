import { UniTemplateStatus } from "@framework/types";
import { IAssetDto } from "../../../uni-token/interfaces";

export interface IErc1155TemplateUpdateDto {
  title: string;
  description: string;
  attributes: string;
  imageUrl: string;
  price: IAssetDto;
  amount: number;
  templateStatus: UniTemplateStatus;
}
