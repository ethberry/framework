import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, Min, IsArray, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import type { IPonziRuleItemSearchDto, IPonziRuleSearchDto } from "@framework/types";
import { PonziRuleStatus, TokenType } from "@framework/types";

export class PonziRuleItemSearchDto implements IPonziRuleItemSearchDto {
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

  public contractIds: Array<number>;
  public templateIds: Array<number>;
  public maxPrice: string;
  public minPrice: string;
}

export class PonziRuleSearchDto extends SearchDto implements IPonziRuleSearchDto {
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
  public contractIds: Array<number>;

  @ApiPropertyOptional({
    type: PonziRuleItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PonziRuleItemSearchDto)
  public deposit: PonziRuleItemSearchDto;

  @ApiPropertyOptional({
    type: PonziRuleItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PonziRuleItemSearchDto)
  public reward: PonziRuleItemSearchDto;

  public ponziRuleStatus: Array<PonziRuleStatus>;
  public merchantId: number;
}
