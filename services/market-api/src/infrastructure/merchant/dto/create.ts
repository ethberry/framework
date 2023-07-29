import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEthereumAddress, IsJSON, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { emailMaxLength } from "@gemunion/constants";

import { IMerchantCreateDto } from "../interfaces";
import { MerchantSocialDto } from "./social";

export class MerchantCreateDto implements IMerchantCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty({
    maxLength: emailMaxLength,
  })
  @IsEmail({}, { message: "patternMismatch" })
  @MaxLength(emailMaxLength, { message: "rangeOverflow" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;

  @ApiProperty()
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
  @ValidateNested()
  @Type(() => MerchantSocialDto)
  public social: MerchantSocialDto;
}
