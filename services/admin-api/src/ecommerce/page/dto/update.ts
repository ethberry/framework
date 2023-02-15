import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { PageStatus } from "@framework/types";

import { IPageUpdateDto } from "../interfaces";
import { PageCreateDto } from "./create";

export class PageUpdateDto extends PageCreateDto implements IPageUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value as PageStatus)
  @IsEnum(PageStatus, { message: "badInput" })
  public pageStatus: PageStatus;
}
