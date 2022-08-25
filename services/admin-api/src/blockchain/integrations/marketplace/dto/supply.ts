import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import type { IMarketplaceSupplySearchDto } from "@framework/types";
import { TokenAttributes } from "@framework/types";

export class MarketplaceSupplySearchDto extends SearchDto implements IMarketplaceSupplySearchDto {
  @ApiProperty({
    enum: TokenAttributes,
  })
  @IsEnum(TokenAttributes, { message: "badInput" })
  public attribute: TokenAttributes;

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
