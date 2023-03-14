import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { ContractFeatures, ITemplateAutocompleteDto, ModuleType, TemplateStatus, TokenType } from "@framework/types";

export class TemplateAutocompleteDto implements ITemplateAutocompleteDto {
  @ApiPropertyOptional({
    enum: TemplateStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<TemplateStatus>)
  @IsEnum(TemplateStatus, { each: true, message: "badInput" })
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
}
