import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Transform } from "class-transformer";

import type { IPredictionContractDeployDto } from "@framework/types";
import { PredictionContractTemplates } from "@framework/types";

export class PredictionContractDeployDto implements IPredictionContractDeployDto {
  @ApiProperty({
    enum: PredictionContractTemplates,
  })
  @Transform(({ value }) => value as PredictionContractTemplates)
  @IsEnum(PredictionContractTemplates, { message: "badInput" })
  public contractTemplate: PredictionContractTemplates;
}
