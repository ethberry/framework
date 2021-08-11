import {ApiPropertyOptional} from "@nestjs/swagger";

import {reEmail} from "@gemunionstudio/constants-regexp";
import {
  emailMaxLength,
  firstNameMaxLength,
  firstNameMinLength,
  lastNameMaxLength,
  lastNameMinLength,
} from "@gemunionstudio/constants-validation";
import {IsString} from "@gemunionstudio/nest-js-validators";
import {DefaultLanguage, EnabledLanguages, rePhoneNumber} from "@gemunionstudio/solo-constants-misc";

import {IsEmail} from "../validators";

export interface IUserCommonDto {
  firstName: string;
  lastName: string;
  language: EnabledLanguages;
  phoneNumber: string;
  imageUrl: string;
  email: string;
}

export class UserCommonDto implements IUserCommonDto {
  @ApiPropertyOptional({
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

  @ApiPropertyOptional({
    maxLength: emailMaxLength,
  })
  @IsEmail({
    required: false,
    regexp: reEmail,
    unique: true,
    maxLength: emailMaxLength,
  })
  public email: string;
}
