import type { IPaginationDto } from "@gemunion/types-collection";

export interface IContractHistorySearchDto extends IPaginationDto {
  address: string;
  tokenId: string;
}
