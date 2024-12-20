import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { ChainIdDto } from "@gemunion/nest-js-validators";
import { ContractFeatures, ModuleType, TemplateStatus, TokenType } from "@framework/types";
import type { ITemplateAutocompleteDto } from "@framework/types";

export class TemplateAutocompleteDto extends ChainIdDto implements ITemplateAutocompleteDto {
  public templateStatus: Array<TemplateStatus>;

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
  public contractType: Array<TokenType>;

  @ApiPropertyOptional({
    enum: ContractFeatures,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ContractFeatures>)
  @IsEnum(ContractFeatures, { each: true, message: "badInput" })
  public contractFeatures: Array<ContractFeatures>;

  @ApiPropertyOptional({
    enum: ModuleType,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ModuleType>)
  @IsEnum(ModuleType, { each: true, message: "badInput" })
  public contractModule: Array<ModuleType>;

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

  public merchantId: number;
}
