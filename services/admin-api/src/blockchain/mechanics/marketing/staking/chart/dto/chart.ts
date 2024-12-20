import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsISO8601, IsOptional, IsString, Min, ValidateIf, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import { IsBeforeDate } from "@gemunion/nest-js-validators";
import type { IStakingChartItemSearchDto, IStakingChartSearchDto } from "@framework/types";
import { TokenType } from "@framework/types";

export class StakingChartItemSearchDto implements IStakingChartItemSearchDto {
  @ApiProperty({
    enum: TokenType,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @Transform(({ value }) => value as TokenType)
  @IsEnum(TokenType, { message: "badInput" })
  public tokenType: TokenType;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public contractId: number;
}

export class StakingChartSearchDto extends PaginationDto implements IStakingChartSearchDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public contractId: number;

  @ApiProperty({
    type: StakingChartItemSearchDto,
  })
  @ValidateNested()
  @Type(() => StakingChartItemSearchDto)
  public deposit: StakingChartItemSearchDto;

  @ApiPropertyOptional({
    type: StakingChartItemSearchDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => StakingChartItemSearchDto)
  public reward: StakingChartItemSearchDto;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => [true, "true"].includes(value))
  public emptyReward: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  @IsBeforeDate({ relatedPropertyName: "endTimestamp" })
  public startTimestamp: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  @ValidateIf(o => !!o.startTimestamp)
  public endTimestamp: string;
}
