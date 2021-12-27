import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { PageStatus } from "@gemunion/framework-types";

import { IPageUpdateDto } from "../interfaces";
import { PageCreateDto } from "./create";

export class PageUpdateDto extends PageCreateDto implements IPageUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(lang => PageStatus[lang as unknown as keyof typeof PageStatus])
  @IsEnum({ enum: PageStatus }, { message: "badInput" })
  public pageStatus: PageStatus;
}
