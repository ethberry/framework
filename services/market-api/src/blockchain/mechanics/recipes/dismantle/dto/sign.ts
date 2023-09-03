import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";
import { AccountDto, ReferrerOptionalDto } from "@gemunion/collection";
import type { ISignDismantleDto } from "@framework/types";

import { ChainIdDto } from "../../../../../common/dto";

export class SignDismantleDto extends Mixin(AccountDto, ReferrerOptionalDto, ChainIdDto) implements ISignDismantleDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public dismantleId: number;

  @ApiProperty({
    type: Number,
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public tokenId: number;
}
