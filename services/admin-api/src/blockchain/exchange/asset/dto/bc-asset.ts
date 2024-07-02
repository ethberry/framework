import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, Min, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";
import { decorate } from "ts-mixer";

import { AddressDto, IsBigInt } from "@gemunion/nest-js-validators";
import type { IBlockChainAssetTemplateDto, IBlockChainAssetTokenDto, IBlockChainAssetDto } from "@framework/types";
import { TokenType } from "@framework/types";

export class BlockChainAssetDto extends AddressDto implements IBlockChainAssetDto {
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
      type: Number,
    }),
  )
  @decorate(IsBigInt({}, { message: "typeMismatch" }))
  @decorate(ValidateIf(o => [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155].includes(o.TokenType)))
  public amount: string;
}

export class BlockChainAssetTemplateDto extends BlockChainAssetDto implements IBlockChainAssetTemplateDto {
  @decorate(
    ApiProperty({
      type: String,
    }),
  )
  @decorate(IsInt({ message: "typeMismatch" }))
  @decorate(Min(1, { message: "rangeUnderflow" }))
  @decorate(ValidateIf(o => [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155].includes(o.TokenType)))
  public templateId: number;
}

export class BlockChainAssetTokenDto extends BlockChainAssetTemplateDto implements IBlockChainAssetTokenDto {
  @decorate(
    ApiProperty({
      type: String,
    }),
  )
  @decorate(IsInt({ message: "typeMismatch" }))
  @decorate(Min(1, { message: "rangeUnderflow" }))
  @decorate(ValidateIf(o => [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155].includes(o.TokenType)))
  public tokenId: number;
}
