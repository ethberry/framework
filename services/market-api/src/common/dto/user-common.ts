import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

import {
  displayNameMaxLength,
  displayNameMinLength,
  emailMaxLength,
  EnabledCountries,
  EnabledGenders,
} from "@gemunion/constants";
import { EnabledLanguages } from "@framework/constants";
import { IUserCommonDto } from "@framework/types";

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: "patternMismatch" })
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
    enum: EnabledCountries,
  })
  @IsOptional()
  @Transform(({ value }) => value as EnabledCountries)
  @IsEnum(EnabledCountries, { message: "badInput" })
  public country: EnabledCountries;

  @ApiPropertyOptional({
    enum: EnabledGenders,
  })
  @IsOptional()
  @Transform(({ value }) => value as EnabledGenders)
  @IsEnum(EnabledGenders, { message: "badInput" })
  public gender: EnabledGenders;

  @ApiPropertyOptional({
    maxLength: emailMaxLength,
  })
  @IsOptional()
  @IsEmail({}, { message: "patternMismatch" })
  @MaxLength(emailMaxLength, { message: "rangeOverflow" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;
}
