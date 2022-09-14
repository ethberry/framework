import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import type { IPyramidRuleItemSearchDto, IPyramidRuleSearchDto } from "@framework/types";
import { PyramidStakingStatus, TokenType } from "@framework/types";

export class PyramidRuleItemSearchDto implements IPyramidRuleItemSearchDto {
  @ApiPropertyOptional({
    enum: TokenType,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<TokenType>)
  @IsEnum(TokenType, { each: true, message: "badInput" })
  public tokenType: Array<TokenType>;

  @ApiPropertyOptional({
    type: Number,
    isArray: true,
    minimum: 1,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public contractIds: Array<number> = [];

  public templateIds: Array<number>;
  public maxPrice: string;
  public minPrice: string;
}

export class PyramidRuleSearchDto extends SearchDto implements IPyramidRuleSearchDto {
  @ApiPropertyOptional({
    enum: PyramidStakingStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<PyramidStakingStatus>)
  @IsEnum(PyramidStakingStatus, { each: true, message: "badInput" })
  public stakingStatus: Array<PyramidStakingStatus>;

  @ApiPropertyOptional({
    type: PyramidRuleItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PyramidRuleItemSearchDto)
  public deposit: PyramidRuleItemSearchDto;

  @ApiPropertyOptional({
    type: PyramidRuleItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PyramidRuleItemSearchDto)
  public reward: PyramidRuleItemSearchDto;
}
