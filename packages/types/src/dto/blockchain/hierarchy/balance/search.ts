import type { ISearchDto } from "@ethberry/types-collection";

export interface IBalanceSearchDto extends ISearchDto {
  contractIds: Array<number>;
  templateIds: Array<number>;
  targetIds: Array<number>;
  accounts: Array<string>;
}
