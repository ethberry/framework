import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Min, Validate } from "class-validator";
import { Transform } from "class-transformer";

import { SearchableOptionalDto } from "@ethberry/collection";
import { ForbidEnumValues } from "@ethberry/nest-js-validators";
import { ContractStatus } from "@framework/types";

import type { IContractUpdateDto } from "../interfaces";

export class ContractUpdateDto extends SearchableOptionalDto implements IContractUpdateDto {
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
  @Validate(ForbidEnumValues, [ContractStatus.NEW])
  @IsEnum(ContractStatus, { message: "badInput" })
  public contractStatus: ContractStatus;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public merchantId: number;
}
