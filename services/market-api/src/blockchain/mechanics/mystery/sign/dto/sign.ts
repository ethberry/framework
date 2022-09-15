import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto } from "@gemunion/collection";

import { ISignMysteryboxDto } from "../interfaces";
import { ReferrerOptionalDto } from "../../../../../common/validators/referrer";

export class SignMysteryboxDto extends Mixin(ReferrerOptionalDto, AccountDto) implements ISignMysteryboxDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public mysteryboxId: number;
}
