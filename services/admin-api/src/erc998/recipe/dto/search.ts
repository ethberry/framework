import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { Erc998RecipeStatus, IErc998RecipeSearchDto } from "@framework/types";

export class Erc998RecipeSearchDto extends SearchDto implements IErc998RecipeSearchDto {
  @ApiPropertyOptional({
    enum: Erc998RecipeStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc998RecipeStatus>)
  @IsEnum(Erc998RecipeStatus, { each: true, message: "badInput" })
  public recipeStatus: Array<Erc998RecipeStatus>;
}
