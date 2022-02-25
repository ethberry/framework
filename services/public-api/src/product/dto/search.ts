import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

import { SortDto } from "@gemunion/collection";

import { IProductSortDto } from "../interfaces";
import { IProduct } from "@gemunion/framework-types";

export class ProductSortDto extends SortDto<IProduct> implements IProductSortDto {
  @ApiPropertyOptional({
    minimum: 1,
    isArray: true,
  })
  @IsOptional()
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public categoryIds: Array<number>;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  merchantId: number;
}
