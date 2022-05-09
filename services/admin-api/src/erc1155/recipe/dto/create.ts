import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IErc1155RecipeCreateDto } from "../interfaces";
import { IngredientsDto } from "./ingredients";

export class Erc1155RecipeCreateDto implements IErc1155RecipeCreateDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public erc1155TokenId: number;

  @ApiProperty({
    type: IngredientsDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => IngredientsDto)
  public ingredients: Array<IngredientsDto>;
}
