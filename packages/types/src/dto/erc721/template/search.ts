import { ISearchDto } from "@gemunion/types-collection";

import { Erc721TemplateStatus } from "../../../entities";

export interface IErc721TemplateSearchDto extends ISearchDto {
  templateStatus: Array<Erc721TemplateStatus>;
  erc721CollectionIds: Array<number>;
  maxPrice: string;
  minPrice: string;
}
