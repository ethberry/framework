import { ApiPropertyOptional } from "@nestjs/swagger";

import { PageStatus } from "@gemunionstudio/framework-types";
import { IsString } from "@gemunionstudio/nest-js-validators";

import { IPageUpdateDto } from "../interfaces";
import { PageCreateDto } from "./create";

export class PageUpdateDto extends PageCreateDto implements IPageUpdateDto {
  @ApiPropertyOptional()
  @IsString({
    required: false,
    enum: PageStatus,
  })
  public pageStatus: PageStatus;
}
