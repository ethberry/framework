import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto } from "@gemunion/collection";
import { AccessControlRoleType } from "@framework/types";

import { AddressDto } from "../../../../common/dto";
import { IAccessControlCheck } from "../interfaces";

export class AccessControlCheck extends Mixin(AccountDto, AddressDto) implements IAccessControlCheck {
  @ApiProperty({
    enum: AccessControlRoleType,
  })
  @Transform(({ value }) => value as AccessControlRoleType)
  @IsEnum(AccessControlRoleType, { message: "badInput" })
  public role: AccessControlRoleType;
}
