import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEthereumAddress, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IsBigNumber } from "@gemunion/nest-js-validators";
import { IBalanceSearchDto } from "@framework/types";

export class BalanceSearchDto extends SearchDto implements IBalanceSearchDto {
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
  public tokenIds: Array<number>;

  @ApiPropertyOptional({
    type: String,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsString({ each: true, message: "typeMismatch" })
  @IsEthereumAddress({ each: true, message: "patternMismatch" })
  @Type(() => String)
  public accounts: Array<string>;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsBigNumber({}, { message: "typeMismatch" })
  public minBalance: string;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsBigNumber({}, { message: "typeMismatch" })
  public maxBalance: string;
}
