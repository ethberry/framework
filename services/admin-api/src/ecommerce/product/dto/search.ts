import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";

import { SearchDto } from "@gemunion/collection";
import { ProductStatus } from "@framework/types";

import { IProductSearchDto } from "../interfaces";

export class ProductSearchDto extends SearchDto implements IProductSearchDto {
  @ApiPropertyOptional({
    minimum: 1,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public categoryIds: Array<number>;

  @ApiPropertyOptional({
    minimum: 1,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public parameterIds: Array<number>;

  @ApiPropertyOptional({
    enum: ProductStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ProductStatus>)
  @IsEnum(ProductStatus, { each: true, message: "badInput" })
  public productStatus: Array<ProductStatus>;
}
