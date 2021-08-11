import {ISearchDto} from "@gemunionstudio/types-collection";
import {MerchantStatus} from "@gemunionstudio/solo-types";

export interface IMerchantSearchDto extends ISearchDto {
  merchantStatus: Array<MerchantStatus>;
}
