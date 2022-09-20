import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { IWaitlistClaimDto } from "../interfaces";

export class WaitlistClaimDto implements IWaitlistClaimDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public listId: number;
}
