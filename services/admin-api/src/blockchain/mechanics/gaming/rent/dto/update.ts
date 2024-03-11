import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString, Min, Validate, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { ForbidEnumValues } from "@gemunion/nest-js-validators";
import { RentRuleStatus } from "@framework/types";

import { IRentUpdateDto } from "../interfaces";
import { SemiCoinDto } from "../../../../exchange/asset/dto";

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
    type: SemiCoinDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @Validate(ForbidEnumValues, [RentRuleStatus.NEW])
  @IsEnum(RentRuleStatus, { message: "badInput" })
  public rentStatus: RentRuleStatus;
}
