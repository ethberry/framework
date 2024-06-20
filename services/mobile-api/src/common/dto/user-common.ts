import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { decorate } from "ts-mixer";

import {
  displayNameMaxLength,
  displayNameMinLength,
  emailMaxLength,
  EnabledCountries,
  EnabledGenders,
} from "@gemunion/constants";
import { EnabledLanguages } from "@framework/constants";
import type { IUserCommonDto } from "@framework/types";

export class UserCommonDto implements IUserCommonDto {
  @decorate(
    ApiProperty({
      minLength: displayNameMinLength,
      maxLength: displayNameMaxLength,
      type: String,
    }),
  )
  @decorate(IsOptional())
  @decorate(IsString({ message: "typeMismatch" }))
  @decorate(MinLength(displayNameMinLength, { message: "rangeUnderflow" }))
  @decorate(MaxLength(displayNameMaxLength, { message: "rangeOverflow" }))
  public displayName: string;

  @decorate(ApiPropertyOptional({ type: String }))
  @decorate(IsOptional())
  @decorate(IsUrl({}, { message: "patternMismatch" }))
  @decorate(IsString({ message: "typeMismatch" }))
  public imageUrl: string;

  @decorate(
    ApiPropertyOptional({
      enum: EnabledLanguages,
    }),
  )
  @decorate(IsOptional())
  @decorate(Transform(({ value }) => value as EnabledLanguages))
  @decorate(IsEnum(EnabledLanguages, { message: "badInput" }))
  public language: EnabledLanguages;

  @decorate(
    ApiPropertyOptional({
      enum: EnabledCountries,
    }),
  )
  @decorate(IsOptional())
  @decorate(Transform(({ value }) => value as EnabledCountries))
  @decorate(IsEnum(EnabledCountries, { message: "badInput" }))
  public country: EnabledCountries;

  @decorate(
    ApiPropertyOptional({
      enum: EnabledGenders,
    }),
  )
  @decorate(IsOptional())
  @decorate(Transform(({ value }) => value as EnabledGenders))
  @decorate(IsEnum(EnabledGenders, { message: "badInput" }))
  public gender: EnabledGenders;

  @decorate(
    ApiPropertyOptional({
      maxLength: emailMaxLength,
      type: String,
    }),
  )
  @decorate(IsOptional())
  @decorate(IsEmail({}, { message: "patternMismatch" }))
  @decorate(MaxLength(emailMaxLength, { message: "rangeOverflow" }))
  @decorate(Transform(({ value }: { value: string }) => value.toLowerCase()))
  public email: string;
}
