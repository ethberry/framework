import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsEnum,
  IsEthereumAddress,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IsBeforeDate } from "@gemunion/nest-js-validators";
import type { IPyramidReportItemSearchDto, IPyramidReportSearchDto } from "@framework/types";
import { PyramidDepositStatus, TokenType } from "@framework/types";

export class PyramidReportItemSearchDto implements IPyramidReportItemSearchDto {
  @ApiPropertyOptional({
    enum: TokenType,
  })
  @IsOptional()
  @Transform(({ value }) => value as TokenType)
  @IsEnum(TokenType, { message: "badInput" })
  public tokenType: TokenType;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public contractId: number;
}

export class PyramidReportSearchDto extends SearchDto implements IPyramidReportSearchDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => (value === "" ? null : value.toLowerCase()))
  public account: string;

  @ApiProperty({
    type: PyramidReportItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PyramidReportItemSearchDto)
  public deposit: PyramidReportItemSearchDto;

  @ApiPropertyOptional({
    type: PyramidReportItemSearchDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PyramidReportItemSearchDto)
  public reward: PyramidReportItemSearchDto;

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
