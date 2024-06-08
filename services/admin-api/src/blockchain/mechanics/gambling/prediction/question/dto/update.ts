import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SemiCoinDto } from "@gemunion/nest-js-validators";
import { SearchableOptionalDto } from "@gemunion/collection";
import { PredictionQuestionStatus } from "@framework/types";

import type { IPredictionQuestionUpdateDto } from "../interfaces";

export class PredictionQuestionUpdateDto extends SearchableOptionalDto implements IPredictionQuestionUpdateDto {
  @ApiPropertyOptional({
    type: SemiCoinDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;

  @ApiPropertyOptional({
    enum: PredictionQuestionStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as PredictionQuestionStatus)
  @IsEnum(PredictionQuestionStatus, { message: "badInput" })
  public questionStatus: PredictionQuestionStatus;
}
