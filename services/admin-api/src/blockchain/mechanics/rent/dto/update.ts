import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsEnum, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IRentUpdateDto } from "../interfaces";
import { PriceDto } from "../../../exchange/asset/dto";
import { RentRuleStatus } from "@framework/types";

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
  @IsEnum(RentRuleStatus, { message: "badInput" })
  public rentStatus: RentRuleStatus;
}
