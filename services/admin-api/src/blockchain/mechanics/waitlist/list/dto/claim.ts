import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Min } from "class-validator";

import { IWaitlistProofDto } from "../interfaces";

export class WaitlistProofDto implements IWaitlistProofDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public listId: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public account: string;
}
