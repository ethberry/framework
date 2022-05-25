import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsOptional, Validate } from "class-validator";
import { Transform } from "class-transformer";

import { ForbidEnumValues } from "@gemunion/nest-js-validators";
import { Erc20TokenStatus } from "@framework/types";

import { IErc20TokenUpdateDto } from "../interfaces";

export class Erc20TokenUpdateDto implements IErc20TokenUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional({
    enum: Erc20TokenStatus,
  })
  @Transform(({ value }) => value as Erc20TokenStatus)
  @IsEnum(Erc20TokenStatus, { message: "badInput" })
  @Validate(ForbidEnumValues, [Erc20TokenStatus.PENDING])
  public tokenStatus: Erc20TokenStatus;
}
