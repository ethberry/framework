import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEthereumAddress, IsJSON, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { emailMaxLength } from "@gemunion/constants";

import { IMerchantUpdateDto } from "../interfaces";
import { MerchantSocialDto } from "./social";

export class MerchantUpdateDto implements IMerchantUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

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
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public wallet: string;

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
