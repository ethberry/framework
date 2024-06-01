import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SemiCoinDto } from "@gemunion/nest-js-validators";
import { SearchableDto } from "@gemunion/collection";

import type { IPredictionQuestionCreateDto } from "../interfaces";

export class PredictionQuestionCreateDto extends SearchableDto implements IPredictionQuestionCreateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiProperty({
    type: SemiCoinDto,
  })
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;

  @ApiProperty({
    minimum: 0,
  })
  @IsInt({ message: "typeMismatch" })
  public maxVotes: number;
}
