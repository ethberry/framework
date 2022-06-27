import { ISearchDto } from "@gemunion/types-collection";

import { UniTemplateStatus } from "../../../entities";

export interface IErc1155TemplateSearchDto extends ISearchDto {
  uniContractIds: Array<number>;
  maxPrice: string;
  minPrice: string;
  templateStatus: Array<UniTemplateStatus>;
}
