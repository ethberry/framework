import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

import {IsString} from "@trejgun/nest-js-validators";
import {UserRole, UserStatus} from "@trejgun/solo-types";

import {IUserUpdateDto} from "../interfaces";
import {ProfileUpdateSchema} from "../../profile/schemas";

export class UserUpdateSchema extends ProfileUpdateSchema implements IUserUpdateDto {
  @ApiProperty({
    enum: UserStatus,
  })
  @IsString({
    enum: UserStatus,
  })
  public userStatus: UserStatus;

  @ApiProperty({
    enum: UserRole,
    isArray: true,
  })
  @IsString({
    enum: UserRole,
    isArray: true,
  })
  public userRoles: Array<UserRole>;

  @ApiPropertyOptional()
  @IsString({
    required: false,
  })
  public comment: string;
}
