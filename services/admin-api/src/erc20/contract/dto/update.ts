import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsOptional, IsString, Validate } from "class-validator";
import { Transform } from "class-transformer";

import { ForbidEnumValues } from "@gemunion/nest-js-validators";
import { UniContractStatus } from "@framework/types";

import { IErc20TemplateUpdateDto } from "../interfaces";

export class Erc20TokenUpdateDto implements IErc20TemplateUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional({
    enum: UniContractStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as UniContractStatus)
  @IsEnum(UniContractStatus, { message: "badInput" })
  @Validate(ForbidEnumValues, [UniContractStatus.NEW])
  public contractStatus: UniContractStatus;
}
