import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, Min } from "class-validator";
import { Transform, Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto, AddressDto } from "@gemunion/nest-js-validators";
import { AccessControlRoleType } from "@framework/types";

import { IAccessControlCheckDto, IAccessControlCheckTokenOwnershipDto } from "../interfaces";

export class AccessControlCheckDto extends Mixin(AccountDto, AddressDto) implements IAccessControlCheckDto {
  @ApiProperty({
    enum: AccessControlRoleType,
  })
  @Transform(({ value }) => value as AccessControlRoleType)
  @IsEnum(AccessControlRoleType, { message: "badInput" })
  public role: AccessControlRoleType;
}

export class AccessControlCheckTokenOwnershipDto
  extends Mixin(AccountDto)
  implements IAccessControlCheckTokenOwnershipDto
{
  @ApiProperty({
    type: Number,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public tokenId: number;
}
