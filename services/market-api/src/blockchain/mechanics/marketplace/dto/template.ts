import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto } from "@gemunion/collection";

import { ISignTemplateDto } from "../interfaces";
import { ReferrerOptionalDto } from "../../../../common/validators/referrer";

export class SignTemplateDto extends Mixin(ReferrerOptionalDto, AccountDto) implements ISignTemplateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public templateId: number;
}
