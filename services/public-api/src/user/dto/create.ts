import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

import { IsString } from "@gemunion/nest-js-validators";
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

import { IsEmail } from "../../common/validators";
import { ValidatePasswordDto } from "../../auth/dto";

export class UserCreateDto extends ValidatePasswordDto implements IUserCreateDto {
  @ApiProperty({
    minLength: firstNameMinLength,
    maxLength: firstNameMaxLength,
  })
  @IsString({
    required: false,
    minLength: firstNameMinLength,
    maxLength: firstNameMaxLength,
  })
  public firstName: string;

  @ApiPropertyOptional({
    minLength: lastNameMinLength,
    maxLength: lastNameMaxLength,
  })
  @IsString({
    required: false,
    minLength: lastNameMinLength,
    maxLength: lastNameMaxLength,
  })
  public lastName: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString({
    required: false,
    regexp: rePhoneNumber,
  })
  public phoneNumber: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString({
    required: false,
  })
  public imageUrl: string;

  @ApiPropertyOptional({
    enum: EnabledLanguages,
  })
  @IsString({
    required: false,
    enum: EnabledLanguages,
  })
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
