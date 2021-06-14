import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsArray, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

import {IsNumber, IsString} from "@trejgun/nest-js-validators";
import {IPhoto} from "@trejgun/solo-types";

import {IProductCreateDto} from "../interfaces";
import {PhotoCreateSchema} from "../../photo/schemas";

export class ProductCreateSchema implements IProductCreateDto {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsString()
  public description: string;

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

  @ApiProperty({type: () => [PhotoCreateSchema]})
  @IsArray()
  @ValidateNested()
  @Type(() => PhotoCreateSchema)
  public photos: Array<IPhoto>;
}
