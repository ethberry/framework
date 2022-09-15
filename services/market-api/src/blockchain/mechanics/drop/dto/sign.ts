import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto } from "@gemunion/collection";

import { ISignDropDto } from "../interfaces";
import { ReferrerOptionalDto } from "../../../../common/validators/referrer";

export class SignDropDto extends Mixin(ReferrerOptionalDto, AccountDto) implements ISignDropDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public dropId: number;
}
