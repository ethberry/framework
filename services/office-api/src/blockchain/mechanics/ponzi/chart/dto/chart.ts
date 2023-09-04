import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsISO8601, IsOptional, IsString, Min, ValidateIf, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import { IsBeforeDate } from "@gemunion/nest-js-validators";
import type { IPonziChartItemSearchDto, IPonziChartSearchDto } from "@framework/types";
import { TokenType } from "@framework/types";

export class PonziChartItemSearchDto implements IPonziChartItemSearchDto {
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

export class PonziChartSearchDto extends PaginationDto implements IPonziChartSearchDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public contractId: number;

  @ApiProperty({
    type: PonziChartItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PonziChartItemSearchDto)
  public deposit: PonziChartItemSearchDto;

  @ApiPropertyOptional({
    type: PonziChartItemSearchDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PonziChartItemSearchDto)
  public reward: PonziChartItemSearchDto;

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
