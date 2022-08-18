import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsEthereumAddress, IsInt, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import {
  ITokenAttributesSearchDto,
  ITokenSearchDto,
  TokenAttributes,
  TokenRarity,
  TokenStatus,
} from "@framework/types";

export class TokenAttributesSearchDto implements ITokenAttributesSearchDto {
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
  public [TokenAttributes.RARITY]: Array<TokenRarity>;
}

export class TokenSearchDto extends SearchDto implements ITokenSearchDto {
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
  public attributes: TokenAttributesSearchDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }) => (value === "" ? null : (value as string)))
  public account: string;

  public tokenStatus: Array<TokenStatus>;
  public tokenId: string;
}
