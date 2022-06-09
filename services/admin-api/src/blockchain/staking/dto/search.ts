import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import { IPaginationDto } from "@gemunion/types-collection";
import { Erc1155RecipeStatus } from "@framework/types";

export class StakingSearchDto extends PaginationDto implements IPaginationDto {
  public title: string;

  @ApiPropertyOptional({
    enum: Erc1155RecipeStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc1155RecipeStatus>)
  @IsEnum(Erc1155RecipeStatus, { each: true, message: "badInput" })
  public recipeStatus: Array<Erc1155RecipeStatus>;
}
