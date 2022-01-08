import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

import { reEthTransaction } from "@gemunion/constants";

import { ITransactionRemoveDto } from "../interfaces";

export class TransactionRemoveDto implements ITransactionRemoveDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @Matches(reEthTransaction, { message: "patternMismatch" })
  public transactionHash: string;
}
