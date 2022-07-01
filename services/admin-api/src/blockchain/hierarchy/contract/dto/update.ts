import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsOptional, IsString, IsUrl, Validate } from "class-validator";
import { Transform } from "class-transformer";

import { ForbidEnumValues } from "@gemunion/nest-js-validators";
import { ContractStatus } from "@framework/types";

import { IContractUpdateDto } from "../interfaces";

export class ContractUpdateDto implements IContractUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiPropertyOptional({
    enum: ContractStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as ContractStatus)
  @IsEnum(ContractStatus, { message: "badInput" })
  @Validate(ForbidEnumValues, [ContractStatus.NEW])
  public contractStatus: ContractStatus;
}
