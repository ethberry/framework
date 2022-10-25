import type { ISearchDto } from "@gemunion/types-collection";

export interface IBalanceSearchDto extends ISearchDto {
  contractIds: Array<number>;
  tokenIds: Array<number>;
  accounts: Array<string>;
  maxBalance: string;
  minBalance: string;
}
