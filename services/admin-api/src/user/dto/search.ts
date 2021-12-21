import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

import { SearchDto } from "@gemunion/collection";
import { IUserSearchDto, UserRole, UserStatus } from "@gemunion/framework-types";

export class UserSearchDto extends SearchDto implements IUserSearchDto {
  @ApiPropertyOptional({
    enum: UserRole,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsEnum({ enum: UserRole }, { each: true, message: "badInput" })
  public userRoles: Array<UserRole>;

  @ApiPropertyOptional({
    enum: UserStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsEnum({ enum: UserStatus }, { each: true, message: "badInput" })
  public userStatus: Array<UserStatus>;
}
