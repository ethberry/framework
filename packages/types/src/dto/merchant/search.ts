import { ISearchDto } from "@gemunion/types-collection";

import { MerchantStatus } from "../../entities";

export interface IMerchantSearchDto extends ISearchDto {
  merchantStatus: Array<MerchantStatus>;
}
