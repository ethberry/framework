import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

import {
  emailMaxLength,
  firstNameMaxLength,
  firstNameMinLength,
  lastNameMaxLength,
  lastNameMinLength,
} from "@gemunion/constants";
import { EnabledLanguages, rePhoneNumber } from "@gemunion/framework-constants";
import { ReCaptcha } from "@gemunion/nest-js-utils";
import { IUserCreateDto } from "@gemunion/framework-types";

import { ValidatePasswordDto } from "../../auth/dto";

export class UserCreateDto extends ValidatePasswordDto implements IUserCreateDto {
  @ApiPropertyOptional({
    minLength: firstNameMinLength,
    maxLength: firstNameMaxLength,
  })
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @MinLength(firstNameMinLength, { message: "rangeUnderflow" })
  @MaxLength(firstNameMaxLength, { message: "rangeOverflow" })
  public firstName: string;

  @ApiPropertyOptional({
    minLength: lastNameMaxLength,
    maxLength: lastNameMinLength,
  })
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @MinLength(lastNameMaxLength, { message: "rangeUnderflow" })
  @MaxLength(lastNameMinLength, { message: "rangeOverflow" })
  public lastName: string;

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
  @Transform(lang => EnabledLanguages[lang as unknown as keyof typeof EnabledLanguages])
  @IsEnum({ enum: EnabledLanguages }, { message: "badInput" })
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
