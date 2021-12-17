import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsJSON, ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";

import { IsNumber, IsString } from "@gemunion/nest-js-validators";
import { IPhoto } from "@gemunion/framework-types";

import { IProductCreateDto } from "../interfaces";
import { PhotoCreateDto } from "../../photo/dto";

export class ProductCreateDto implements IProductCreateDto {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty({
    isArray: true,
    minimum: 1,
  })
  @IsNumber({
    isArray: true,
    minimum: 1,
  })
  public categoryIds: Array<number>;

  @ApiProperty({
    minimum: 0,
  })
  @IsNumber({
    minimum: 0,
  })
  public price: number;

  @ApiProperty({
    minimum: 0,
  })
  @IsNumber({
    minimum: 0,
  })
  public amount: number;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsNumber({
    required: false,
    minimum: 1,
  })
  public merchantId: number;

  @ApiPropertyOptional({ type: () => [PhotoCreateDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => PhotoCreateDto)
  public photos: Array<IPhoto> = [];
}
