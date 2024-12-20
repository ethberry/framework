import type { ISearchDto } from "@gemunion/types-collection";

export interface IBalanceSearchDto extends ISearchDto {
  contractIds: Array<number>;
  templateIds: Array<number>;
  targetIds: Array<number>;
  accounts: Array<string>;
}
