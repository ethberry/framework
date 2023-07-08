import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

import { IRaffleOptionsDto } from "../interfaces";

export class RaffleOptionsDto implements IRaffleOptionsDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public contractId: number;
}
