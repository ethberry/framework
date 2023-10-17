import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import type { IWaitListClaimDto } from "../interfaces";

export class WaitListProofDto implements IWaitListClaimDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public listId: number;
}
