import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
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
  @Transform(lang => UserRole[lang as unknown as keyof typeof UserRole])
  @IsEnum({ enum: UserRole }, { each: true, message: "badInput" })
  public userRoles: Array<UserRole>;
}
