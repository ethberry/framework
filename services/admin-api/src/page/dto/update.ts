import { ApiPropertyOptional } from "@nestjs/swagger";

import { PageStatus } from "@gemunion/framework-types";
import { IsString } from "@gemunion/nest-js-validators";

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
