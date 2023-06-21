import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";

import { IsBigInt } from "@gemunion/nest-js-validators";
import type { IAssetComponentDto } from "@framework/types";
import { TokenType } from "@framework/types";

export class ItemComponentDto implements IAssetComponentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public id?: number;

  @ApiProperty({
    enum: TokenType,
  })
  @Transform(({ value }) => value as TokenType)
  // commented out because user has to have a way redeem his balance from mobile-api
  // @Validate(ForbidEnumValues, [TokenType.NATIVE, TokenType.ERC20])
  @IsEnum(TokenType, { message: "badInput" })
  public tokenType: TokenType;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @ValidateIf(o => [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155].includes(o.TokenType))
  public templateId: number;

  @ApiProperty({
    type: Number,
  })
  @IsBigInt({}, { message: "typeMismatch" })
  @ValidateIf(o => [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155].includes(o.TokenType))
  public amount: string;
}
