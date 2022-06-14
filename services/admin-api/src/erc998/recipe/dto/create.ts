import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, Min, ValidateIf, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IErc998RecipeCreateDto } from "../interfaces";
import { IngredientsDto } from "./ingredients";

export class Erc998RecipeCreateDto implements IErc998RecipeCreateDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @ValidateIf(o => !o.erc998DropboxId)
  public erc998TemplateId: number;

  @ApiPropertyOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @ValidateIf(o => !o.erc998TemplateId)
  public erc998DropboxId: number;

  @ApiProperty({
    type: IngredientsDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => IngredientsDto)
  public ingredients: Array<IngredientsDto>;
}
