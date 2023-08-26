import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";

import { IsBigInt } from "@gemunion/nest-js-validators";
import { IAssetComponentDto, TokenType } from "@framework/types";

export class DepositComponentDto implements IAssetComponentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public id?: number;

  @ApiProperty({
    enum: TokenType,
  })
  @Transform(({ value }) => value as TokenType)
  @IsEnum(TokenType, { message: "badInput" })
  public tokenType: TokenType;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiPropertyOptional()
  @IsOptional()
  // @IsInt({ message: "typeMismatch" })
  // @Min(0, { message: "rangeUnderflow" })
  @ValidateIf(o => [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155].includes(o.TokenType))
  public templateId: number;

  @ApiProperty({
    type: Number,
  })
  @IsBigInt({}, { message: "typeMismatch" })
  @ValidateIf(o => [TokenType.NATIVE, TokenType.ERC20].includes(o.TokenType))
  public amount: string;
}
