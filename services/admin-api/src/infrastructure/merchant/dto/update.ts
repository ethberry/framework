import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsJSON, IsOptional, IsString, ValidateNested, MaxLength } from "class-validator";
import { Transform, Type } from "class-transformer";

// import { rePhoneNumber } from "@framework/constants";
import { IMerchantUpdateDto } from "../interfaces";
import { MerchantSocialDto } from "./social";
import { emailMaxLength } from "@gemunion/constants";

export class MerchantUpdateDto implements IMerchantUpdateDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  // @Matches(rePhoneNumber, { message: "patternMismatch" })
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
