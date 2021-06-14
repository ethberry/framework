import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

import {IsString} from "@trejgun/nest-js-validators";
import {
  emailMaxLength,
  firstNameMaxLength,
  firstNameMinLength,
  lastNameMaxLength,
  lastNameMinLength,
} from "@trejgun/constants-validation";
import {reEmail} from "@trejgun/constants-regexp";
import {DefaultLanguage, EnabledLanguages, rePhoneNumber} from "@trejgun/solo-constants-misc";

import {ReCaptcha, IsEmail} from "../../common/validators";
import {ValidatePasswordSchema} from "../../auth/schemas";
import {IUserCreateDto} from "../interfaces";

export class UserCreateSchema extends ValidatePasswordSchema implements IUserCreateDto {
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
