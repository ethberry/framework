import { ISearchDto } from "@gemunionstudio/types-collection";
import { MerchantStatus } from "@gemunionstudio/framework-types";

export interface IMerchantSearchDto extends ISearchDto {
  merchantStatus: Array<MerchantStatus>;
}
