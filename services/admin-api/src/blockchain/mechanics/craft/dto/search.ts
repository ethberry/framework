import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { CraftStatus, IExchangeSearchDto } from "@framework/types";

export class Erc721RecipeSearchDto extends SearchDto implements IExchangeSearchDto {
  @ApiPropertyOptional({
    enum: CraftStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<CraftStatus>)
  @IsEnum(CraftStatus, { each: true, message: "badInput" })
  public craftStatus: Array<CraftStatus>;
}
