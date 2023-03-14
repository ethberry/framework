import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsInt, IsNumber, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { DurationUnit } from "@framework/types";
import { SearchableDto } from "@gemunion/collection";

import { IStakingCreateDto } from "../interfaces";
import { DepositDto } from "./deposit";
import { RewardDto } from "./reward";

export class StakingCreateDto extends SearchableDto implements IStakingCreateDto {
  @ApiProperty({
    type: DepositDto,
  })
  @ValidateNested()
  @Type(() => DepositDto)
  public deposit: DepositDto;

  @ApiProperty({
    type: RewardDto,
  })
  @ValidateNested()
  @Type(() => RewardDto)
  public reward: RewardDto;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public durationAmount: number;

  @ApiProperty({
    enum: DurationUnit,
  })
  @Transform(({ value }) => value as DurationUnit)
  @IsEnum(DurationUnit, { message: "badInput" })
  public durationUnit: DurationUnit;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public penalty: number;

  @ApiProperty()
  @IsBoolean({ message: "typeMismatch" })
  public recurrent: boolean;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;
}
