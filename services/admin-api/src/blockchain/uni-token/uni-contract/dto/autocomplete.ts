import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import {
  IUniContractAutocompleteDto,
  TokenType,
  UniContractRole,
  UniContractStatus,
  UniContractTemplate,
} from "@framework/types";

export class UniContractAutocompleteDto implements IUniContractAutocompleteDto {
  @ApiPropertyOptional({
    enum: UniContractStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<UniContractStatus>)
  @IsEnum(UniContractStatus, { each: true, message: "badInput" })
  public contractStatus: Array<UniContractStatus>;

  @ApiPropertyOptional({
    enum: UniContractRole,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<UniContractRole>)
  @IsEnum(UniContractRole, { each: true, message: "badInput" })
  public contractRole: Array<UniContractRole>;

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
    enum: UniContractTemplate,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<UniContractTemplate>)
  @IsEnum(UniContractTemplate, { each: true, message: "badInput" })
  public contractTemplate: Array<UniContractTemplate>;
}
