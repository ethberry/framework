import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import type { ICraftCountDto } from "@framework/types";

export class CraftCountDto implements ICraftCountDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;
}
