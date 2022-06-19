import { ISearchDto } from "@gemunion/types-collection";

import { Erc998TemplateStatus } from "../../../entities";

export interface IErc998TemplateSearchDto extends ISearchDto {
  templateStatus: Array<Erc998TemplateStatus>;
  erc998CollectionIds: Array<number>;
  maxPrice: string;
  minPrice: string;
}
