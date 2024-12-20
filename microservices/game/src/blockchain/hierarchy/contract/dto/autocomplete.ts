import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { ChainIdDto } from "@gemunion/nest-js-validators";
import type { IContractAutocompleteDto } from "@framework/types";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

export class ContractAutocompleteDto extends ChainIdDto implements IContractAutocompleteDto {
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

  public contractStatus: Array<ContractStatus>;
  public excludeFeatures: Array<ContractFeatures>;
  public merchantId: number;
  public includeExternalContracts: boolean;
}
