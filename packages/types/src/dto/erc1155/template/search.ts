import { ISearchDto } from "@gemunion/types-collection";

import { TemplateStatus } from "../../../entities";

export interface IErc1155TemplateSearchDto extends ISearchDto {
  contractIds: Array<number>;
  maxPrice: string;
  minPrice: string;
  templateStatus: Array<TemplateStatus>;
}
