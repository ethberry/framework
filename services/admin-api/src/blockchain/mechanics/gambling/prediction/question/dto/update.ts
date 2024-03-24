import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SemiCoinDto } from "@gemunion/nest-js-validators";
import { SearchableOptionalDto } from "@gemunion/collection";

import type { IPredictionQuestionUpdateDto } from "../interfaces";

export class PredictionQuestionUpdateDto extends SearchableOptionalDto implements IPredictionQuestionUpdateDto {
  @ApiPropertyOptional({
    type: SemiCoinDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;
}
