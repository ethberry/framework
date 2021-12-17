import { ApiPropertyOptional } from "@nestjs/swagger";

import { IsString } from "@gemunion/nest-js-validators";
import { UserRole, UserStatus } from "@gemunion/framework-types";

import { IUserUpdateDto } from "../interfaces";
import { ProfileUpdateDto } from "../../profile/dto";

export class UserUpdateDto extends ProfileUpdateDto implements IUserUpdateDto {
  @ApiPropertyOptional({
    enum: UserStatus,
  })
  @IsString({
    enum: UserStatus,
    required: false,
  })
  public userStatus: UserStatus;

  @ApiPropertyOptional({
    enum: UserRole,
    isArray: true,
  })
  @IsString({
    enum: UserRole,
    isArray: true,
    required: false,
  })
  public userRoles: Array<UserRole>;

  @ApiPropertyOptional()
  @IsString({
    required: false,
  })
  public comment: string;
}
