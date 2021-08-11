import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

import {IsString} from "@gemunionstudio/nest-js-validators";
import {
  emailMaxLength,
  firstNameMaxLength,
  firstNameMinLength,
  lastNameMaxLength,
  lastNameMinLength,
} from "@gemunionstudio/constants-validation";
import {reEmail} from "@gemunionstudio/constants-regexp";
import {DefaultLanguage, EnabledLanguages, rePhoneNumber} from "@gemunionstudio/framework-constants-misc";

import {ReCaptcha, IsEmail} from "../../common/validators";
import {ValidatePasswordDto} from "../../auth/dto";
import {IUserCreateDto} from "../interfaces";

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
  public language: EnabledLanguages = DefaultLanguage;

  @ApiProperty({
    maxLength: emailMaxLength,
  })
  @IsEmail({
    regexp: reEmail,
    unique: true,
    maxLength: emailMaxLength,
  })
  public email: string;

  @ApiProperty()
  @ReCaptcha()
  public captcha: string;
}
