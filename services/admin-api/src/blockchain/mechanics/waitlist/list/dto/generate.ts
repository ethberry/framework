import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { IWaitlistGenerateDto } from "../interfaces";

export class WaitlistGenerateDto implements IWaitlistGenerateDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public listId: number;
}
