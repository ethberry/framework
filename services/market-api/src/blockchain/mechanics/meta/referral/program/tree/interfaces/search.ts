import type { ISearchDto } from "@gemunion/types-collection";

export interface IReferralTreeSearchDto extends ISearchDto {
  merchantIds?: Array<number>;
}
