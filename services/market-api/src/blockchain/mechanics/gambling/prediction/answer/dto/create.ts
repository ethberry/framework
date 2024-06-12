import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform } from "class-transformer";

import type { IPredictionAnswerCreateDto } from "@framework/types";
import { PredictionAnswer } from "@framework/types";

export class PredictionAnswerCreateDto implements IPredictionAnswerCreateDto {
  @ApiProperty({
    enum: PredictionAnswer,
  })
  @IsOptional()
  @Transform(({ value }) => value as PredictionAnswer)
  @IsEnum(PredictionAnswer, { message: "badInput" })
  public answer: PredictionAnswer;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public questionId: number;
}
