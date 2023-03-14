import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { UserRole, UserStatus } from "@framework/types";

import { IUserUpdateDto } from "../interfaces";
import { ProfileUpdateDto } from "../../profile/dto";

export class UserUpdateDto extends ProfileUpdateDto implements IUserUpdateDto {
  @ApiPropertyOptional({
    enum: UserStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as UserStatus)
  @IsEnum(UserStatus, { message: "badInput" })
  public userStatus: UserStatus;

  @ApiPropertyOptional({
    enum: UserRole,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<UserRole>)
  @IsEnum(UserRole, { each: true, message: "badInput" })
  public userRoles: Array<UserRole>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public comment: string;
}
