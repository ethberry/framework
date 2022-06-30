import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNumber, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IErc998TokenSearchDto, TokenRarity, TokenStatus } from "@framework/types";
import { IsBigNumber } from "@gemunion/nest-js-validators";

export class Erc998TokenSearchDto extends SearchDto implements IErc998TokenSearchDto {
  @ApiPropertyOptional({
    enum: TokenStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<TokenStatus>)
  @IsEnum(TokenStatus, { each: true, message: "badInput" })
  public tokenStatus: Array<TokenStatus>;

  @ApiPropertyOptional({
    type: Number,
    isArray: true,
    minimum: 1,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsNumber({}, { each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public contractIds: Array<number>;

  @ApiPropertyOptional({
    enum: TokenRarity,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<TokenRarity>)
  @IsEnum(TokenRarity, { each: true, message: "badInput" })
  public rarity: Array<TokenRarity>;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
  })
  @IsOptional()
  @IsBigNumber({ allowEmptyString: true }, { message: "typeMismatch" })
  public tokenId: string;
}
