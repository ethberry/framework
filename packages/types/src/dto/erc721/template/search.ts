import { ISearchDto } from "@gemunion/types-collection";

import { UniTemplateStatus } from "../../../entities";

export interface IErc721TemplateSearchDto extends ISearchDto {
  templateStatus: Array<UniTemplateStatus>;
  erc721CollectionIds: Array<number>;
  maxPrice: string;
  minPrice: string;
}
