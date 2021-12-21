import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

import { PageStatus } from "@gemunion/framework-types";

import { IPageUpdateDto } from "../interfaces";
import { PageCreateDto } from "./create";

export class PageUpdateDto extends PageCreateDto implements IPageUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum({ enum: PageStatus }, { message: "badInput" })
  public pageStatus: PageStatus;
}
