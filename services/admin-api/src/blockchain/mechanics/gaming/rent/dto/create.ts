import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString, Min, ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";

import { SemiCoinDto } from "@ethberry/nest-js-validators";
import { RentRuleStatus } from "@framework/types";

import type { IRentCreateDto } from "../interfaces";

export class RentCreateDto implements IRentCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty({
    type: SemiCoinDto,
  })
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(RentRuleStatus, { message: "badInput" })
  public rentStatus: RentRuleStatus;
}
