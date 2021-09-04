import { ISearchDto } from "@gemunion/types-collection";

import { MerchantStatus } from "../../entity";

export interface IMerchantSearchDto extends ISearchDto {
  merchantStatus: Array<MerchantStatus>;
}
