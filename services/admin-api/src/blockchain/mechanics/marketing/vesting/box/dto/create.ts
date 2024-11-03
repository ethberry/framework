import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString, IsUrl, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchableDto } from "@ethberry/collection";
import { SemiCoinDto } from "@ethberry/nest-js-validators";
import { ShapeType } from "@framework/types";

import type { IVestingBoxCreateDto } from "../interfaces";

export class VestingBoxCreateDto extends SearchableDto implements IVestingBoxCreateDto {
  @ApiProperty({
    type: SemiCoinDto,
  })
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public content: InstanceType<typeof SemiCoinDto>;

  @ApiProperty({
    type: SemiCoinDto,
  })
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;

  @ApiProperty()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiProperty({
    enum: ShapeType,
  })
  @Transform(({ value }) => value as ShapeType)
  @IsEnum(ShapeType, { message: "badInput" })
  public shape: ShapeType;

  @ApiProperty({
    minimum: 1,
  })
  @Min(1, { message: "rangeUnderflow" })
  public startTimestamp: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public duration: number;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public period: number;

  @ApiProperty({
    minimum: 0,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public cliff: number;

  @ApiProperty({
    minimum: 0,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public afterCliffBasisPoints: number;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public growthRate: number;
}
