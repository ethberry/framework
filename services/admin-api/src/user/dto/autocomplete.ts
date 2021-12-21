import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

import { UserRole } from "@gemunion/framework-types";

import { IUserAutocompleteDto } from "../interfaces";

export class UserAutocompleteDto implements IUserAutocompleteDto {
  @ApiPropertyOptional({
    enum: UserRole,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsEnum({ enum: UserRole }, { each: true, message: "badInput" })
  public userRoles: Array<UserRole>;
}
