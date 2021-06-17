import {ApiPropertyOptional} from "@nestjs/swagger";
import {Type} from "class-transformer";

import {SortDto} from "@trejgun/collection";
import {IsNumber} from "@trejgun/nest-js-validators";

import {IProductSortDto} from "../interfaces";
import {IProduct} from "@trejgun/solo-types";

export class ProductSortDto extends SortDto<IProduct> implements IProductSortDto {
  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsNumber({
    minimum: 1,
    required: false,
  })
  @Type(() => Number)
  merchantId: number;
}
