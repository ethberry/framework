import {ApiPropertyOptional} from "@nestjs/swagger";

import {UserRole} from "@gemunionstudio/framework-types";
import {IsString} from "@gemunionstudio/nest-js-validators";

import {IUserAutocompleteDto} from "../interfaces";

export class UserAutocompleteDto implements IUserAutocompleteDto {
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
}
