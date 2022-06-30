import { ISearchDto } from "@gemunion/types-collection";

import { TemplateStatus } from "../../../entities";

export interface ITemplateSearchDto extends ISearchDto {
  templateStatus: Array<TemplateStatus>;
  contractIds: Array<number>;
  maxPrice: string;
  minPrice: string;
}
