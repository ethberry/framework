import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import { IErc998AssetSearchDto, TokenRarity } from "@framework/types";

export class Erc998AssetSearchDto extends PaginationDto implements IErc998AssetSearchDto {
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
  public erc998CollectionIds: Array<number>;

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
}
