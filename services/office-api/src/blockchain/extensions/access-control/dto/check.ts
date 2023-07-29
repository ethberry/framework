import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto } from "@gemunion/collection";
import { AccessControlRoleType } from "@framework/types";

import { AddressDto } from "../../../../common/dto";
import { IAccessControlCheckDto } from "../interfaces";

export class AccessControlCheckDto extends Mixin(AccountDto, AddressDto) implements IAccessControlCheckDto {
  @ApiProperty({
    enum: AccessControlRoleType,
  })
  @Transform(({ value }) => value as AccessControlRoleType)
  @IsEnum(AccessControlRoleType, { message: "badInput" })
  public role: AccessControlRoleType;
}
