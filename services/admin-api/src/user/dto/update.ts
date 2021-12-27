import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { UserRole, UserStatus } from "@gemunion/framework-types";

import { IUserUpdateDto } from "../interfaces";
import { ProfileUpdateDto } from "../../profile/dto";

export class UserUpdateDto extends ProfileUpdateDto implements IUserUpdateDto {
  @ApiPropertyOptional({
    enum: UserStatus,
  })
  @IsOptional()
  @Transform(status => UserStatus[status as unknown as keyof typeof UserStatus])
  @IsEnum({ enum: UserStatus }, { message: "badInput" })
  public userStatus: UserStatus;

  @ApiPropertyOptional({
    enum: UserRole,
    isArray: true,
  })
  @IsOptional()
  @Transform(status => UserRole[status as unknown as keyof typeof UserRole])
  @IsEnum({ enum: UserRole }, { each: true, message: "badInput" })
  public userRoles: Array<UserRole>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public comment: string;
}
