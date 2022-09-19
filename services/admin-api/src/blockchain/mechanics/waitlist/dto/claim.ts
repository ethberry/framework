import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Min } from "class-validator";

import { IWaitlistClaimDto } from "../interfaces";

export class WaitlistClaimDto implements IWaitlistClaimDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public listId: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public account: string;
}
