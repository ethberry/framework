import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, Min, ValidateIf, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IErc721RecipeCreateDto } from "../interfaces";
import { IngredientsDto } from "./ingredients";

export class Erc721RecipeCreateDto implements IErc721RecipeCreateDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @ValidateIf(o => !o.erc721DropboxId)
  public erc721TemplateId: number;

  @ApiPropertyOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @ValidateIf(o => !o.erc721TemplateId)
  public erc721DropboxId: number;

  @ApiProperty({
    type: IngredientsDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => IngredientsDto)
  public ingredients: Array<IngredientsDto>;
}
