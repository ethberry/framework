import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { emailMaxLength } from "@gemunion/constants";
import { SearchableOptionalDto, WalletOptionalDto } from "@gemunion/collection";

import { IMerchantUpdateDto } from "../interfaces";
import { MerchantSocialDto } from "./social";

export class MerchantUpdateDto extends Mixin(WalletOptionalDto, SearchableOptionalDto) implements IMerchantUpdateDto {
  @ApiPropertyOptional({
    maxLength: emailMaxLength,
  })
  @IsOptional()
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
  @IsString({ message: "typeMismatch" })
  public imageUrl = "";

  @ApiPropertyOptional({
    type: MerchantSocialDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MerchantSocialDto)
  public social: MerchantSocialDto;
}
