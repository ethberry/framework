import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { SearchDto, SortDto } from "@gemunion/collection";
import { IProduct } from "@framework/types";

import { IProductSearchDto } from "../interfaces";
import { ParamsDto } from "./params";

// TODO typescript?
export class ProductSearchDto extends Mixin(SearchDto, SortDto<IProduct>, ParamsDto) implements IProductSearchDto {
  @ApiPropertyOptional({
    minimum: 1,
    isArray: true,
  })
  @IsOptional()
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  @Type(() => Number)
  public categoryIds: Array<number>;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Type(() => Number)
  merchantId?: number;
}
