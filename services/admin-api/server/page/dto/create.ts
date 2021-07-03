import {ApiProperty} from "@nestjs/swagger";
import {IsJSON} from "class-validator";

import {IsString} from "@trejgun/nest-js-validators";

import {IPageCreateDto} from "../interfaces";

export class PageCreateDto implements IPageCreateDto {
  @ApiProperty()
  @IsString()
  public slug: string;

  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsJSON({message: "patternMismatch"})
  public description: string;
}
