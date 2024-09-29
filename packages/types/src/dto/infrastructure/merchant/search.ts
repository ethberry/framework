import type { ISearchDto } from "@ethberry/types-collection";

import { MerchantStatus } from "../../../entities";

export interface IMerchantSearchDto extends ISearchDto {
  merchantStatus: Array<MerchantStatus>;
}
