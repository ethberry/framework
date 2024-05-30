import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SemiCoinDto } from "@gemunion/nest-js-validators";
import { SearchableDto } from "@gemunion/collection";

import type { IPredictionQuestionCreateDto } from "../interfaces";

export class PredictionQuestionCreateDto extends SearchableDto implements IPredictionQuestionCreateDto {
  @ApiProperty({
    type: SemiCoinDto,
  })
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;
}
