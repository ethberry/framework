import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUrl, Validate } from "class-validator";
import { Transform } from "class-transformer";
import { ForbidEnumValues } from "@gemunion/nest-js-validators";
import { TokenStatus } from "@framework/types";

import { ITokenUpdateDto } from "../interfaces";

export class TokenUpdateDto implements ITokenUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiPropertyOptional({
    enum: TokenStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as TokenStatus)
  @IsEnum(TokenStatus, { message: "badInput" })
  @Validate(ForbidEnumValues, [TokenStatus.BURNED])
  public tokenStatus: TokenStatus;
}
