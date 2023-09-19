import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { IWaitListGenerateDto } from "../interfaces";

export class WaitListGenerateDto implements IWaitListGenerateDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public listId: number;
}
