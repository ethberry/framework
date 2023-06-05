import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, Min } from "class-validator";

import { SearchDto } from "@gemunion/collection";

import { IProductItemSearchDto } from "../interfaces";

export class ProductItemSearchDto extends SearchDto implements IProductItemSearchDto {
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
}
