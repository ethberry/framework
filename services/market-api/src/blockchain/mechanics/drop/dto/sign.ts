import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ReferrerOptionalDto } from "@gemunion/collection";

import { ISignDropDto } from "../interfaces";
import { ChainIdDto } from "../../../../common/dto";

export class SignDropDto extends Mixin(AccountDto, ReferrerOptionalDto, ChainIdDto) implements ISignDropDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public dropId: number;
}
