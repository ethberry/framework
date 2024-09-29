import type { ISearchDto } from "@ethberry/types-collection";

export interface IReferralTreeSearchDto extends ISearchDto {
  merchantIds?: Array<number>;
}
