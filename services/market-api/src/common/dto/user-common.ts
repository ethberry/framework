import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

import { displayNameMaxLength, displayNameMinLength, emailMaxLength } from "@gemunion/constants";
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

  @ApiPropertyOptional({
    type: String,
  })
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
    maxLength: emailMaxLength,
  })
  @IsOptional()
  @IsEmail({}, { message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;
}
