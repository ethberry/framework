import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@ethberry/collection";
import type { IPredictionQuestionSearchDto } from "@framework/types";
import { PredictionQuestionStatus } from "@framework/types";

export class PredictionQuestionSearchDto extends SearchDto implements IPredictionQuestionSearchDto {
  @ApiPropertyOptional({
    enum: PredictionQuestionStatus,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<PredictionQuestionStatus>)
  @IsEnum(PredictionQuestionStatus, { each: true, message: "badInput" })
  public questionStatus: Array<PredictionQuestionStatus>;
}
