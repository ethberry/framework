import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsJSON, IsOptional, IsString, IsUrl, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SemiCoinDto } from "@ethberry/nest-js-validators";
import { ShapeType, VestingBoxStatus } from "@framework/types";

import type { IVestingBoxUpdateDto } from "../interfaces";

export class VestingBoxUpdateDto implements IVestingBoxUpdateDto {
  @ApiPropertyOptional({
    type: SemiCoinDto,
  })
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public content: InstanceType<typeof SemiCoinDto>;

  @ApiPropertyOptional({
    type: SemiCoinDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(VestingBoxStatus, { message: "badInput" })
  public vestingBoxStatus: VestingBoxStatus;

  @ApiPropertyOptional({
    enum: ShapeType,
  })
  @Transform(({ value }) => value as ShapeType)
  @IsEnum(ShapeType, { message: "badInput" })
  public shape: ShapeType;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public startTimestamp: number;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public duration: number;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public period: number;

  @ApiPropertyOptional({
    minimum: 0,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public cliff: number;

  @ApiPropertyOptional({
    minimum: 0,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public afterCliffBasisPoints: number;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public growthRate: number;
}
