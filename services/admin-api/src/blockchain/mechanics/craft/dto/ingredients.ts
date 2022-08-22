import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IAssetDto } from "@framework/types";

import { IngredientsComponentDto } from "./ingredients-components";

export class IngredientsDto implements IAssetDto {
  @ApiProperty({
    type: IngredientsComponentDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => IngredientsComponentDto)
  public components: Array<IngredientsComponentDto>;
}
