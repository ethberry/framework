import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import type { IPonziRuleItemSearchDto, IPonziRuleSearchDto, PonziRuleStatus } from "@framework/types";
import { PonziDepositStatus, TokenType } from "@framework/types";

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

export class PonziRuleSearchDto extends SearchDto implements IPonziRuleSearchDto {
  @ApiPropertyOptional({
    enum: PonziDepositStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<PonziDepositStatus>)
  @IsEnum(PonziDepositStatus, { each: true, message: "badInput" })
  public ponziRuleStatus: Array<PonziRuleStatus>;

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
}
