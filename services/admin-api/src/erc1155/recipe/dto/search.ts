import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IErc1155RecipeSearchDto, RecipeStatus } from "@framework/types";

export class Erc1155RecipeSearchDto extends SearchDto implements IErc1155RecipeSearchDto {
  @ApiPropertyOptional({
    enum: RecipeStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<RecipeStatus>)
  @IsEnum(RecipeStatus, { each: true, message: "badInput" })
  public recipeStatus: Array<RecipeStatus>;
}
