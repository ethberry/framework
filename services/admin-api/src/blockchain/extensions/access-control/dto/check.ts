import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Transform } from "class-transformer";

import { AccessControlRoleType } from "@framework/types";

import { IAccessControlCheckDto } from "../interfaces";
import { AccessControlSearchDto } from "./search";

export class AccessControlCheckDto extends AccessControlSearchDto implements IAccessControlCheckDto {
  @ApiProperty({
    enum: AccessControlRoleType,
  })
  @Transform(({ value }) => value as AccessControlRoleType)
  @IsEnum(AccessControlRoleType, { message: "badInput" })
  public role: AccessControlRoleType;
}
