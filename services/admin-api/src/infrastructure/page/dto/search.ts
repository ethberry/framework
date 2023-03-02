import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsEnum, IsOptional } from "class-validator";

import { SearchDto } from "@gemunion/collection";
import { IPageSearchDto, PageStatus } from "@framework/types";

export class PageSearchDto extends SearchDto implements IPageSearchDto {
  @ApiPropertyOptional({
    enum: PageStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<PageStatus>)
  @IsEnum(PageStatus, { each: true, message: "badInput" })
  public pageStatus: Array<PageStatus>;
}
