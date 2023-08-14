import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { IInvitationCreateDto } from "../interfaces";

export class InvitationCreateDto implements IInvitationCreateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  public userId: number;
}
