import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { Erc721RecipeStatus, IErc721RecipeSearchDto } from "@framework/types";

export class Erc721RecipeSearchDto extends SearchDto implements IErc721RecipeSearchDto {
  @ApiPropertyOptional({
    enum: Erc721RecipeStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc721RecipeStatus>)
  @IsEnum(Erc721RecipeStatus, { each: true, message: "badInput" })
  public recipeStatus: Array<Erc721RecipeStatus>;
}
