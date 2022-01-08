import { IPaginationDto } from "@gemunion/types-collection";

import { TransactionStatus } from "./tx";

export interface ITransactionSearchDto extends IPaginationDto {
  fromBlock?: number;
  toBlock?: number;
  transactionHash?: string;
  status?: Array<TransactionStatus>;
}
