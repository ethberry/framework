import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ReferrerOptionalDto } from "@gemunion/collection";
import { IsBigInt } from "@gemunion/nest-js-validators";
import type { ISignTemplateDto } from "@framework/types";

import { ChainIdDto } from "../../../../common/common/dto";

export class SignTemplateDto extends Mixin(AccountDto, ReferrerOptionalDto, ChainIdDto) implements ISignTemplateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public templateId: number;

  @ApiProperty({
    type: Number,
    minimum: 1,
  })
  @IsBigInt({}, { message: "typeMismatch" })
  public amount: string;
}
