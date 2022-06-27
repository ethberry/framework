import { ISearchDto } from "@gemunion/types-collection";

import { UniTemplateStatus } from "../../../entities";

export interface IErc998TemplateSearchDto extends ISearchDto {
  templateStatus: Array<UniTemplateStatus>;
  uniContractIds: Array<number>;
  maxPrice: string;
  minPrice: string;
}
