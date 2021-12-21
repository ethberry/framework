import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, IsString, Max, Min } from "class-validator";

import { emailMaxLength, firstNameMaxLength, firstNameMinLength } from "@gemunion/constants";
import { EnabledLanguages } from "@gemunion/framework-constants";
import { IUserCommonDto } from "@gemunion/framework-types";

export class UserCommonDto implements IUserCommonDto {
  @ApiPropertyOptional({
    minLength: firstNameMinLength,
    maxLength: firstNameMaxLength,
  })
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @Min(firstNameMinLength, { message: "rangeUnderflow" })
  @Max(firstNameMaxLength, { message: "overUnderflow" })
  public displayName: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiPropertyOptional({
    enum: EnabledLanguages,
  })
  @IsOptional()
  @IsEnum({ enum: EnabledLanguages }, { message: "badInput" })
  public language: EnabledLanguages = EnabledLanguages.EN;

  @ApiPropertyOptional({
    maxLength: emailMaxLength,
  })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;
}
