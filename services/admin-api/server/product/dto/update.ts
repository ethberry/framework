import {ApiProperty} from "@nestjs/swagger";

import {ProductStatus} from "@trejgun/solo-types";
import {IsString} from "@trejgun/nest-js-validators";

import {IProductUpdateDto} from "../interfaces";
import {ProductCreateDto} from "./create";

export class ProductUpdateDto extends ProductCreateDto implements IProductUpdateDto {
  @ApiProperty({
    enum: ProductStatus,
  })
  @IsString({
    enum: ProductStatus,
  })
  public productStatus: ProductStatus;
}
