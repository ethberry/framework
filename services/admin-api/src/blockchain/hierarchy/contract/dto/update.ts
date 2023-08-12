import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsOptional, IsString, IsUrl, Validate } from "class-validator";
import { Transform } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";
import { ForbidEnumValues } from "@gemunion/nest-js-validators";
import { ContractStatus } from "@framework/types";

import { IContractUpdateDto } from "../interfaces";

export class ContractUpdateDto extends SearchableDto implements IContractUpdateDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;
}
