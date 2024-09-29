import type { ISearchDto } from "@ethberry/types-collection";

import { TemplateStatus } from "../../../../entities";

export interface ITemplateSearchDto extends ISearchDto {
  templateStatus: Array<TemplateStatus>;
  contractIds: Array<number>;
  maxPrice: string;
  minPrice: string;

  chainId: number;
  merchantId: number;
}
