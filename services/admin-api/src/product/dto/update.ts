import { ApiProperty } from "@nestjs/swagger";

import { ProductStatus } from "@gemunion/framework-types";
import { IsString } from "@gemunion/nest-js-validators";

import { IProductUpdateDto } from "../interfaces";
import { ProductCreateDto } from "./create";

export class ProductUpdateDto extends ProductCreateDto implements IProductUpdateDto {
  @ApiProperty({
    enum: ProductStatus,
  })
  @IsString({
    enum: ProductStatus,
  })
  public productStatus: ProductStatus;
}
