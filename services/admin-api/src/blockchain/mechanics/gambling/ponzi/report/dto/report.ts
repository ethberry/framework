import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { PaginationDto } from "@ethberry/collection";
import { AccountOptionalDto, IsBeforeDate } from "@ethberry/nest-js-validators";
import type { IPonziReportItemSearchDto, IPonziReportSearchDto } from "@framework/types";
import { PonziDepositStatus, TokenType } from "@framework/types";

export class PonziReportItemSearchDto implements IPonziReportItemSearchDto {
  @ApiProperty({
    enum: TokenType,
  })
  @Transform(({ value }) => value as TokenType)
  @IsEnum(TokenType, { message: "badInput" })
  public tokenType: TokenType;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public contractId: number;
}

export class PonziReportSearchDto extends Mixin(AccountOptionalDto, PaginationDto) implements IPonziReportSearchDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public contractId: number;

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

  @ApiProperty({
    type: PonziReportItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PonziReportItemSearchDto)
  public deposit: PonziReportItemSearchDto;

  @ApiProperty({
    type: PonziReportItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PonziReportItemSearchDto)
  public reward: PonziReportItemSearchDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  @IsBeforeDate({ relatedPropertyName: "endTimestamp" })
  public startTimestamp: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  @ValidateIf(o => !!o.startTimestamp)
  public endTimestamp: string;
}
