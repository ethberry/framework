import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";

import type { IPonziDepositItemSearchDto, IPonziDepositSearchDto } from "@framework/types";
import { PonziDepositStatus, TokenType } from "@framework/types";

export class PonziDepositItemSearchDto implements IPonziDepositItemSearchDto {
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
}

export class PonziDepositSearchDto extends SearchDto implements IPonziDepositSearchDto {
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
  public ponziDepositStatus: Array<PonziDepositStatus>;

  @ApiPropertyOptional({
    type: PonziDepositItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PonziDepositItemSearchDto)
  public deposit: PonziDepositItemSearchDto;

  @ApiPropertyOptional({
    type: PonziDepositItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PonziDepositItemSearchDto)
  public reward: PonziDepositItemSearchDto;

  public account: string;
  public startTimestamp: string;
  public endTimestamp: string;
}
