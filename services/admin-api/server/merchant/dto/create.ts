import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsJSON } from "class-validator";
import { Transform } from "class-transformer";

import { IsNumber, IsString } from "@gemunion/nest-js-validators";
import { rePhoneNumber } from "@gemunion/framework-constants";

import { IMerchantCreateDto } from "../interfaces";
import { IsEmail } from "../../common/validators";

export class MerchantCreateDto implements IMerchantCreateDto {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
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
