import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

import type { IContractManagerUpdateDto } from "../interfaces";
import { ContractType } from "@framework/types";

export class ContractManagerUpdateDto implements IContractManagerUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public address: string;

  @ApiPropertyOptional({
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  public fromBlock: number;

  @ApiPropertyOptional({
    enum: ContractType,
  })
  @Transform(({ value }) => value as ContractType)
  @IsEnum(ContractType, { message: "badInput" })
  public contractType: ContractType;
}
