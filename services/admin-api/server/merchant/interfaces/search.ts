import { ISearchDto } from "@gemunion/types-collection";
import { MerchantStatus } from "@gemunion/framework-types";

export interface IMerchantSearchDto extends ISearchDto {
  merchantStatus: Array<MerchantStatus>;
}
