import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import type { IMarketplaceSupplySearchDto } from "@framework/types";
import { TokenMetadata, TokenStatus, TokenType } from "@framework/types";

export class MarketplaceSupplySearchDto extends SearchDto implements IMarketplaceSupplySearchDto {
  @ApiProperty({
    enum: TokenStatus,
  })
  @Transform(({ value }) => value as TokenStatus)
  @IsEnum(TokenStatus, { message: "badInput" })
  public tokenStatus: TokenStatus;

  @ApiProperty({
    enum: TokenType,
  })
  @Transform(({ value }) => value as TokenType)
  @IsEnum(TokenType, { message: "badInput" })
  public tokenType: TokenType;

  @ApiProperty({
    enum: TokenMetadata,
  })
  @IsEnum(TokenMetadata, { message: "badInput" })
  public attribute: TokenMetadata;

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
}
