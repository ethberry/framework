import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, IsUrl, MaxLength, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { emailMaxLength } from "@ethberry/constants";
import { SearchableDto } from "@ethberry/collection";
import { WalletDto } from "@ethberry/nest-js-validators";

import type { IMerchantCreateDto } from "../interfaces";
import { MerchantSocialDto } from "./social";

export class MerchantCreateDto extends Mixin(SearchableDto, WalletDto) implements IMerchantCreateDto {
  @ApiProperty({
    maxLength: emailMaxLength,
  })
  @IsEmail({}, { message: "patternMismatch" })
  @MaxLength(emailMaxLength, { message: "rangeOverflow" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public phoneNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl = "";

  @ApiPropertyOptional({
    type: MerchantSocialDto,
  })
  @ValidateNested()
  @Type(() => MerchantSocialDto)
  public social: MerchantSocialDto;
}
