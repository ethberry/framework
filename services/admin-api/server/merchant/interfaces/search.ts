import {ISearchDto} from "@trejgun/types-collection";
import {MerchantStatus} from "@trejgun/solo-types";

export interface IMerchantSearchDto extends ISearchDto {
  merchantStatus: Array<MerchantStatus>;
}
