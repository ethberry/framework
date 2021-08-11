import {ApiPropertyOptional} from "@nestjs/swagger";

import {IsString} from "@gemunionstudio/nest-js-validators";
import {SearchDto} from "@gemunionstudio/collection";
import {UserRole, UserStatus} from "@gemunionstudio/solo-types";

import {IUserSearchDto} from "../interfaces";

export class UserSearchDto extends SearchDto implements IUserSearchDto {
  @ApiPropertyOptional({
    enum: UserRole,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsString({
    enum: UserRole,
    isArray: true,
    required: false,
  })
  public userRoles: Array<UserRole>;

  @ApiPropertyOptional({
    enum: UserStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsString({
    enum: UserStatus,
    isArray: true,
    required: false,
  })
  public userStatus: Array<UserStatus>;
}
