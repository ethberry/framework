import {ApiProperty} from "@nestjs/swagger";
import {IsJSON} from "class-validator";

import {IsNumber, IsString} from "@trejgun/nest-js-validators";

import {ICategoryCreateDto} from "../interfaces";

export class CategoryCreateDto implements ICategoryCreateDto {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsJSON({message: "patternMismatch"})
  public description: string;

  @ApiProperty()
  @IsNumber()
  public parentId: number;
}
