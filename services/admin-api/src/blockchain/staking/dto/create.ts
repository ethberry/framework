import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsEthereumAddress,
  IsInt,
  IsJSON,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { Transform, Type } from "class-transformer";

import { IsBigNumber } from "@gemunion/nest-js-validators";
import { ItemType } from "@framework/types";

import { IStakingCreateDto, IStakingItemCreateDto } from "../interfaces";

export class StakingItemCreateDto implements IStakingItemCreateDto {
  @ApiProperty({
    enum: ItemType,
  })
  @Transform(({ value }) => value as ItemType)
  @IsEnum(ItemType, { message: "badInput" })
  public itemType: ItemType;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public token: string;

  @ApiProperty({
    type: Number,
  })
  @IsBigNumber({}, { message: "typeMismatch" })
  public criteria: string;

  @ApiProperty({
    type: Number,
  })
  @IsBigNumber({}, { message: "typeMismatch" })
  public amount: string;
}

export class StakingCreateDto implements IStakingCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty({
    type: StakingItemCreateDto,
  })
  @ValidateNested()
  @Type(() => StakingItemCreateDto)
  public deposit: StakingItemCreateDto;

  @ApiProperty({
    type: StakingItemCreateDto,
  })
  @ValidateNested()
  @Type(() => StakingItemCreateDto)
  public reward: StakingItemCreateDto;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public duration: string;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public penalty: number;

  @ApiProperty()
  @IsBoolean({ message: "typeMismatch" })
  public recurrent: boolean;
}
