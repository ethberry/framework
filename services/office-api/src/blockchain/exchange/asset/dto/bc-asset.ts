import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsEthereumAddress, IsInt, Min, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";
import { decorate } from "ts-mixer";

import { IsBigInt } from "@gemunion/nest-js-validators";
import type { IBCAssetDto } from "@framework/types";
import { TokenType } from "@framework/types";

export class BCAssetDto implements IBCAssetDto {
  @decorate(
    ApiProperty({
      enum: TokenType,
    }),
  )
  @decorate(Transform(({ value }) => value as TokenType))
  @decorate(IsEnum(TokenType, { message: "badInput" }))
  public tokenType: TokenType;

  @decorate(
    ApiProperty({
      type: String,
    }),
  )
  @decorate(IsEthereumAddress({ message: "patternMismatch" }))
  @decorate(Transform(({ value }: { value: string }) => value.toLowerCase()))
  public address: string;

  @decorate(
    ApiProperty({
      type: String,
    }),
  )
  @decorate(IsInt({ message: "typeMismatch" }))
  @decorate(Min(1, { message: "rangeUnderflow" }))
  @decorate(ValidateIf(o => [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155].includes(o.TokenType)))
  public templateId: number;

  @decorate(
    ApiProperty({
      type: Number,
    }),
  )
  @decorate(IsBigInt({}, { message: "typeMismatch" }))
  @decorate(ValidateIf(o => [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155].includes(o.TokenType)))
  public amount: string;
}
