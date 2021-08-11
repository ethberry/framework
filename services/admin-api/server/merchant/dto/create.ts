import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsJSON} from "class-validator";

import {IsNumber, IsString} from "@gemunionstudio/nest-js-validators";
import {reEmail} from "@gemunionstudio/constants-regexp";
import {rePhoneNumber} from "@gemunionstudio/framework-constants-misc";

import {IMerchantCreateDto} from "../interfaces";
import {IsEmail} from "../../common/validators";

export class MerchantCreateDto implements IMerchantCreateDto {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsJSON({message: "patternMismatch"})
  public description: string;

  @ApiProperty()
  @IsEmail({
    regexp: reEmail,
  })
  public email: string;

  @ApiPropertyOptional()
  @IsString({
    required: false,
    regexp: rePhoneNumber,
  })
  public phoneNumber: string;

  @ApiPropertyOptional({
    type: Number,
    isArray: true,
  })
  @IsNumber({
    required: false,
    isArray: true,
  })
  public userIds: Array<number>;

  @ApiPropertyOptional()
  @IsString({
    required: false,
  })
  public imageUrl = "";
}
