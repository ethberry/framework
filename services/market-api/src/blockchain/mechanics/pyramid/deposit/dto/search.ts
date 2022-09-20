import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";

import type { IPyramidDepositItemSearchDto, IPyramidDepositSearchDto } from "@framework/types";
import { PyramidDepositStatus, TokenType } from "@framework/types";

export class PyramidDepositItemSearchDto implements IPyramidDepositItemSearchDto {
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

export class PyramidDepositSearchDto extends SearchDto implements IPyramidDepositSearchDto {
  @ApiPropertyOptional({
    enum: PyramidDepositStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<PyramidDepositStatus>)
  @IsEnum(PyramidDepositStatus, { each: true, message: "badInput" })
  public pyramidDepositStatus: Array<PyramidDepositStatus>;

  @ApiPropertyOptional({
    type: PyramidDepositItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PyramidDepositItemSearchDto)
  public deposit: PyramidDepositItemSearchDto;

  @ApiPropertyOptional({
    type: PyramidDepositItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PyramidDepositItemSearchDto)
  public reward: PyramidDepositItemSearchDto;

  public account: string;
  public startTimestamp: string;
  public endTimestamp: string;
}
