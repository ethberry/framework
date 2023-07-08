import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

import { ILotteryOptionsDto } from "../interfaces";

export class LotteryOptionsDto implements ILotteryOptionsDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public contractId: number;
}
