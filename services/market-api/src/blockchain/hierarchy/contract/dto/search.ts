import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import type { IContractSearchDto } from "@framework/types";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

export class ContractSearchDto extends SearchDto implements IContractSearchDto {
  @ApiPropertyOptional({
    enum: ContractStatus,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ContractStatus>)
  @IsEnum(ContractStatus, { each: true, message: "badInput" })
  public contractStatus: Array<ContractStatus>;

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
    enum: TokenType,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => value as Array<TokenType>)
  @IsEnum(TokenType, { each: true, message: "badInput" })
  public contractType: Array<TokenType>;

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
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  @Type(() => Number)
  public merchantId: number;
}
