import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { decorate } from "ts-mixer";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

export class ContractStatusDto {
  @decorate(
    ApiProperty({
      enum: ContractStatus,
      isArray: true,
    }),
  )
  @decorate(IsArray({ message: "typeMismatch" }))
  @decorate(Transform(({ value }) => value as Array<ContractStatus>))
  @decorate(IsEnum(ContractStatus, { each: true, message: "badInput" }))
  public contractStatus: Array<ContractStatus>;
}

export class ContractFeaturesDto {
  @decorate(
    ApiProperty({
      enum: ContractFeatures,
      isArray: true,
    }),
  )
  @decorate(IsArray({ message: "typeMismatch" }))
  @decorate(Transform(({ value }) => value as Array<ContractFeatures>))
  @decorate(IsEnum(ContractFeatures, { each: true, message: "badInput" }))
  public contractFeatures: Array<ContractFeatures>;
}

export class ContractTypeDto {
  @decorate(
    ApiProperty({
      enum: TokenType,
      isArray: true,
    }),
  )
  @decorate(IsArray({ message: "typeMismatch" }))
  @decorate(Transform(({ value }) => value as Array<TokenType>))
  @decorate(IsEnum(TokenType, { each: true, message: "badInput" }))
  public contractType: Array<TokenType>;
}

export class ContractModuleDto {
  @decorate(
    ApiProperty({
      enum: ModuleType,
      isArray: true,
    }),
  )
  @decorate(IsArray({ message: "typeMismatch" }))
  @decorate(Transform(({ value }) => value as Array<ModuleType>))
  @decorate(IsEnum(ModuleType, { each: true, message: "badInput" }))
  public contractModule: Array<ModuleType>;
}
