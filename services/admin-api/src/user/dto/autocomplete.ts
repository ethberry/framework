import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

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
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<UserRole>)
  @IsEnum(UserRole, { each: true, message: "badInput" })
  public userRoles: Array<UserRole>;
}
