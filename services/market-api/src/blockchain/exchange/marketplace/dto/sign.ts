import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { IsBigInt, ReferrerOptionalDto } from "@gemunion/nest-js-validators";
import type { ITemplateSignDto } from "@framework/types";

export class TemplateSignDto extends Mixin(ReferrerOptionalDto) implements ITemplateSignDto {
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

  public chainId: number;
  public account: string;
}
