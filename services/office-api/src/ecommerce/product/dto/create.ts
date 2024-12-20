import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Allow, IsArray, IsInt, IsJSON, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import type { IPhoto } from "@framework/types";

import type { IProductCreateDto } from "../interfaces";
import { PhotoCreateDto } from "../../photo/dto";

export class ProductCreateDto implements IProductCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty({
    isArray: true,
    minimum: 1,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  public categoryIds: Array<number>;

  @ApiPropertyOptional({ type: () => [PhotoCreateDto] })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @ValidateNested()
  @Type(() => PhotoCreateDto)
  public photos: Array<IPhoto> = [];

  @Allow()
  public parameters: Array<any> = [];

  @Allow()
  public productItems: Array<any> = [];
}
