import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString, Matches, ValidateIf } from "class-validator";

import { PaginationDto } from "@gemunion/collection";
import { reEthTransaction } from "@gemunion/constants";

import { ITransactionSearchDto, TransactionStatus } from "../interfaces";

export class TransactionSearchDto extends PaginationDto implements ITransactionSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @Matches(reEthTransaction, { message: "patternMismatch" })
  public transactionHash: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TransactionStatus, { each: true, message: "badInput" })
  public status: Array<TransactionStatus>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  public fromBlock: number;

  @ApiPropertyOptional()
  @ValidateIf(o => !!o.startBlockNumber)
  @IsInt({ message: "typeMismatch" })
  public toBlock: number;
}
