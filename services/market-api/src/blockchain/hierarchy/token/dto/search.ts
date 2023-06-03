import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountOptionalDto, SearchDto } from "@gemunion/collection";
import type { ITokenMetadataSearchDto, ITokenSearchDto } from "@framework/types";
import { TokenMetadata, TokenRarity, TokenStatus } from "@framework/types";

export class TokenAttributesSearchDto implements ITokenMetadataSearchDto {
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
  public [TokenMetadata.RARITY]: Array<TokenRarity>;

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
  public [TokenMetadata.GRADE]: Array<number>;
}

export class TokenSearchDto extends Mixin(AccountOptionalDto, SearchDto) implements ITokenSearchDto {
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
  public templateIds: Array<number>;

  @ApiPropertyOptional({
    type: TokenAttributesSearchDto,
  })
  @ValidateNested()
  @Type(() => TokenAttributesSearchDto)
  public metadata: TokenAttributesSearchDto;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public merchantId: number;

  public tokenStatus: Array<TokenStatus>;
  public tokenId: string;
}
