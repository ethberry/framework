import { ApiPropertyOptional } from "@nestjs/swagger";

import { UserRole } from "@gemunion/framework-types";
import { IsString } from "@gemunion/nest-js-validators";

import { IUserAutocompleteDto } from "../interfaces";

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
