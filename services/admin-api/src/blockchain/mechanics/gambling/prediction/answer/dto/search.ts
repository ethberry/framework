import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import type { IPredictionAnswerSearchDto } from "@framework/types";

export class PredictionQuestionSearchDto extends SearchDto implements IPredictionAnswerSearchDto {
  @ApiPropertyOptional({
    type: Number,
    isArray: true,
    minimum: 1,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public questionIds: Array<number>;
}
