import {ApiProperty} from "@nestjs/swagger";

import {IsNumber, IsString} from "@trejgun/nest-js-validators";

import {ICategoryCreateDto} from "../interfaces";

export class CategoryCreateDto implements ICategoryCreateDto {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsString()
  public description: string;

  @ApiProperty()
  @IsNumber()
  public parentId: number;
}
