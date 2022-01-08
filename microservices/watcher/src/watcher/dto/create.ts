import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, Matches, Min } from "class-validator";

import { reEthTransaction } from "@gemunion/constants";

import { ITransactionCreateDto } from "../interfaces";

export class TransactionCreateDto implements ITransactionCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @Matches(reEthTransaction, { message: "patternMismatch" })
  public transactionHash: string;

  @ApiProperty()
  @IsNumber({}, { message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public projectId: number;
}
