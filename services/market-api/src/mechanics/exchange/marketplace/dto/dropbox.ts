import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { ISignDropboxDto } from "../interfaces";

export class SignDropboxDto implements ISignDropboxDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public dropboxId: number;
}
