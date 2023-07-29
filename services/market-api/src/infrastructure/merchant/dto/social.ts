import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl, ValidateIf } from "class-validator";

import { IMerchantSocial } from "@framework/types";

export class MerchantSocialDto implements IMerchantSocial {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf(e => e.twitterUrl !== "")
  @IsString({ message: "typeMismatch" })
  @IsUrl({}, { message: "patternMismatch" })
  public twitterUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf(e => e.instagramUrl !== "")
  @IsString({ message: "typeMismatch" })
  @IsUrl({}, { message: "patternMismatch" })
  public instagramUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf(e => e.youtubeUrl !== "")
  @IsString({ message: "typeMismatch" })
  @IsUrl({}, { message: "patternMismatch" })
  public youtubeUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf(e => e.facebookUrl !== "")
  @IsString({ message: "typeMismatch" })
  @IsUrl({}, { message: "patternMismatch" })
  public facebookUrl: string;
}
