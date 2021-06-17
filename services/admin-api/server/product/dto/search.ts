import {ApiPropertyOptional} from "@nestjs/swagger";

import {IsString} from "@trejgun/nest-js-validators";
import {SearchDto} from "@trejgun/collection";
import {ProductStatus} from "@trejgun/solo-types";

import {IProductSearchDto} from "../interfaces";

export class ProductSearchDto extends SearchDto implements IProductSearchDto {
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
