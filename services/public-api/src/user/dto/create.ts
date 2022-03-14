import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

import { displayNameMaxLength, displayNameMinLength, emailMaxLength } from "@gemunion/constants";
import { EnabledLanguages, rePhoneNumber } from "@gemunion/framework-constants";
import { ReCaptcha } from "@gemunion/nest-js-validators";
import { IUserCreateDto } from "@gemunion/framework-types";

import { ValidatePasswordDto } from "../../auth/dto";

export class UserCreateDto extends ValidatePasswordDto implements IUserCreateDto {
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
  @Matches(rePhoneNumber, { message: "patternMismatch" })
  public phoneNumber: string;

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

  @ApiProperty({
    maxLength: emailMaxLength,
  })
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;

  @ApiProperty()
  @ReCaptcha()
  public captcha: string;
}
