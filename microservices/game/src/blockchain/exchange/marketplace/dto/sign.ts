import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ChainIdDto, ReferrerOptionalDto, IsBigInt } from "@ethberry/nest-js-validators";
import type { ITemplateSignDto } from "@framework/types";

export class TemplateSignDto extends Mixin(AccountDto, ChainIdDto, ReferrerOptionalDto) implements ITemplateSignDto {
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
