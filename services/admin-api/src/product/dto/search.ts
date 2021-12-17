import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

import { IsNumber, IsString } from "@gemunion/nest-js-validators";
import { SearchDto } from "@gemunion/collection";
import { ProductStatus } from "@gemunion/framework-types";

import { IProductSearchDto } from "../interfaces";

export class ProductSearchDto extends SearchDto implements IProductSearchDto {
  @ApiPropertyOptional({
    minimum: 1,
    isArray: true,
  })
  @IsNumber({
    minimum: 1,
    required: false,
    isArray: true,
  })
  @Type(() => Number)
  public categoryIds: Array<number>;

  @ApiPropertyOptional({
    enum: ProductStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsString({
    enum: ProductStatus,
    isArray: true,
    required: false,
  })
  public productStatus: Array<ProductStatus>;
}
