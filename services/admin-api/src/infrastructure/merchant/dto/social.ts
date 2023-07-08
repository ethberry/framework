import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl } from "class-validator";

import { IMerchantSocial } from "@framework/types";

export class MerchantSocialDto implements IMerchantSocial {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsUrl({}, { message: "patternMismatch" })
  public twitterUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsUrl({}, { message: "patternMismatch" })
  public instagramUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsUrl({}, { message: "patternMismatch" })
  public youtubeUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsUrl({}, { message: "patternMismatch" })
  public facebookUrl: string;
}
