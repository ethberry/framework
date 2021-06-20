import {ApiPropertyOptional} from "@nestjs/swagger";
import {Type} from "class-transformer";

import {IsNumber, IsString} from "@trejgun/nest-js-validators";
import {SearchDto} from "@trejgun/collection";
import {ProductStatus} from "@trejgun/solo-types";

import {IProductSearchDto} from "../interfaces";

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
