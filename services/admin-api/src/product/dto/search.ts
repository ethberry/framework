import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, Min } from "class-validator";

import { SearchDto } from "@gemunion/collection";
import { ProductStatus } from "@gemunion/framework-types";

import { IProductSearchDto } from "../interfaces";

export class ProductSearchDto extends SearchDto implements IProductSearchDto {
  @ApiPropertyOptional({
    minimum: 1,
    isArray: true,
  })
  @IsOptional()
  @IsNumber({}, { each: true, message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public categoryIds: Array<number>;

  @ApiPropertyOptional({
    enum: ProductStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @Transform(lang => ProductStatus[lang as unknown as keyof typeof ProductStatus])
  @IsEnum({ enum: ProductStatus }, { each: true, message: "badInput" })
  public productStatus: Array<ProductStatus>;
}
