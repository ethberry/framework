import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

import {IsString} from "@gemunionstudio/nest-js-validators";
import {UserRole, UserStatus} from "@gemunionstudio/framework-types";

import {IUserUpdateDto} from "../interfaces";
import {ProfileUpdateDto} from "../../profile/dto";

export class UserUpdateDto extends ProfileUpdateDto implements IUserUpdateDto {
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
