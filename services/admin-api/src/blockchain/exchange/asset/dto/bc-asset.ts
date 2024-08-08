import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, Min, Validate, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";
import { decorate } from "ts-mixer";

import { AddressDto, ForbidEnumValues, IsBigInt } from "@gemunion/nest-js-validators";
import type { IBlockChainAssetDto, IBlockChainAssetTemplateDto, IBlockChainAssetTokenDto } from "@framework/types";
import { TokenType } from "@framework/types";

export class BlockChainAssetDto extends AddressDto implements IBlockChainAssetDto {
  @decorate(
    ApiProperty({
      type: Number,
    }),
  )
  @decorate(IsBigInt({}, { message: "typeMismatch" }))
  @decorate(ValidateIf(o => [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155].includes(o.tokenType)))
  public amount: string;
}

export class BlockChainAssetTemplateDto extends BlockChainAssetDto implements IBlockChainAssetTemplateDto {
  @decorate(
    ApiProperty({
      enum: TokenType,
    }),
  )
  @decorate(Transform(({ value }) => value as TokenType))
  @decorate(Validate(ForbidEnumValues, [TokenType.NATIVE, TokenType.ERC20]))
  @decorate(IsEnum(TokenType, { message: "badInput" }))
  public tokenType: TokenType;

  @decorate(
    ApiProperty({
      type: String,
    }),
  )
  @decorate(IsInt({ message: "typeMismatch" }))
  @decorate(Min(1, { message: "rangeUnderflow" }))
  @decorate(ValidateIf(o => [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155].includes(o.tokenType)))
  public templateId: number;
}

export class BlockChainAssetTokenDto extends BlockChainAssetTemplateDto implements IBlockChainAssetTokenDto {
  @decorate(
    ApiProperty({
      enum: TokenType,
    }),
  )
  @decorate(Transform(({ value }) => value as TokenType))
  @decorate(Validate(ForbidEnumValues, [TokenType.NATIVE]))
  @decorate(IsEnum(TokenType, { message: "badInput" }))
  public tokenType: TokenType;

  @decorate(
    ApiProperty({
      type: String,
    }),
  )
  @decorate(IsInt({ message: "typeMismatch" }))
  @decorate(Min(1, { message: "rangeUnderflow" }))
  @decorate(ValidateIf(o => [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155].includes(o.tokenType)))
  public tokenId: number;
}

export class BlockChainAssetVestingDto extends BlockChainAssetTemplateDto implements IBlockChainAssetTokenDto {
  @decorate(
    ApiProperty({
      enum: TokenType,
    }),
  )
  @decorate(Transform(({ value }) => value as TokenType))
  @Validate(ForbidEnumValues, [TokenType.NATIVE, TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155])
  @decorate(IsEnum(TokenType, { message: "badInput" }))
  public tokenType: TokenType;

  @decorate(
    ApiProperty({
      type: String,
    }),
  )
  @decorate(IsInt({ message: "typeMismatch" }))
  @decorate(Min(1, { message: "rangeUnderflow" }))
  @decorate(ValidateIf(o => [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155].includes(o.tokenType)))
  public tokenId: number;
}
