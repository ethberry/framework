import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { ContractRole, ContractStatus, ContractTemplate, IContractAutocompleteDto, TokenType } from "@framework/types";

export class ContractAutocompleteDto implements IContractAutocompleteDto {
  @ApiPropertyOptional({
    enum: ContractStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ContractStatus>)
  @IsEnum(ContractStatus, { each: true, message: "badInput" })
  public contractStatus: Array<ContractStatus>;

  @ApiPropertyOptional({
    enum: ContractRole,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ContractRole>)
  @IsEnum(ContractRole, { each: true, message: "badInput" })
  public contractRole: Array<ContractRole>;

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
    enum: ContractTemplate,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ContractTemplate>)
  @IsEnum(ContractTemplate, { each: true, message: "badInput" })
  public contractTemplate: Array<ContractTemplate>;
}
