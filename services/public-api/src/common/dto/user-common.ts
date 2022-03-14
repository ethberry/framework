import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

import { displayNameMaxLength, displayNameMinLength, emailMaxLength } from "@gemunion/constants";
import { EnabledLanguages } from "@gemunion/framework-constants";
import { IUserCommonDto } from "@gemunion/framework-types";

export class UserCommonDto implements IUserCommonDto {
  @ApiPropertyOptional({
    minLength: displayNameMinLength,
    maxLength: displayNameMaxLength,
  })
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @MinLength(displayNameMinLength, { message: "rangeUnderflow" })
  @MaxLength(displayNameMaxLength, { message: "rangeOverflow" })
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
  @Transform(({ value }) => value as EnabledLanguages)
  @IsEnum(EnabledLanguages, { message: "badInput" })
  public language: EnabledLanguages = EnabledLanguages.EN;

  @ApiPropertyOptional({
    maxLength: emailMaxLength,
  })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;
}
