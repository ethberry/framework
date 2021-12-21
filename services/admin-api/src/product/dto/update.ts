import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { ProductStatus } from "@gemunion/framework-types";

import { IProductUpdateDto } from "../interfaces";
import { ProductCreateDto } from "./create";

export class ProductUpdateDto extends ProductCreateDto implements IProductUpdateDto {
  @ApiProperty({
    enum: ProductStatus,
  })
  @IsEnum(
    {
      enum: ProductStatus,
    },
    { message: "badInput" },
  )
  public productStatus: ProductStatus;
}
