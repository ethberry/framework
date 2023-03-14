import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IUserSearchDto, UserRole, UserStatus } from "@framework/types";

export class UserSearchDto extends SearchDto implements IUserSearchDto {
  @ApiPropertyOptional({
    enum: UserRole,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<UserRole>)
  @IsEnum(UserRole, { each: true, message: "badInput" })
  public userRoles: Array<UserRole>;

  @ApiPropertyOptional({
    enum: UserStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<UserStatus>)
  @IsEnum(UserStatus, { each: true, message: "badInput" })
  public userStatus: Array<UserStatus>;
}
