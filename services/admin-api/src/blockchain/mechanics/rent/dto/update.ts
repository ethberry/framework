import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString, Min, Validate, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { ForbidEnumValues } from "@gemunion/nest-js-validators";
import { RentRuleStatus } from "@framework/types";

import { PriceDto } from "../../../exchange/asset/dto";
import { IRentUpdateDto } from "../interfaces";

export class RentUpdateDto implements IRentUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiPropertyOptional({
    type: PriceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDto)
  public price: PriceDto;

  @ApiPropertyOptional()
  @IsOptional()
  @Validate(ForbidEnumValues, [RentRuleStatus.NEW])
  @IsEnum(RentRuleStatus, { message: "badInput" })
  public rentStatus: RentRuleStatus;
}
