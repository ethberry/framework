import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNumber, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

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
  public duration: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public penalty: number;

  @ApiProperty()
  @IsBoolean({ message: "typeMismatch" })
  public recurrent: boolean;
}
