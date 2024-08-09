import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotIn, Min, ValidateIf } from "class-validator";
import { decorate, Mixin } from "ts-mixer";

import { AddressDto, IsBigInt, TokenTypeDto } from "@gemunion/nest-js-validators";
import type { IBlockChainAssetDto, IBlockChainAssetTemplateDto, IBlockChainAssetTokenDto } from "@framework/types";
import { TokenType } from "@framework/types";

export class AmountDto {
  @decorate(
    ApiProperty({
      type: Number,
    }),
  )
  @decorate(IsBigInt({}, { message: "typeMismatch" }))
  public amount: string;
}

export class BlockChainAssetDto extends Mixin(AddressDto, AmountDto, TokenTypeDto) implements IBlockChainAssetDto {
  protected forbiddenTypes: Array<TokenType> = [];

  @IsNotIn(this.forbiddenTypes)
  public tokenType: TokenType;

  @decorate(ValidateIf(o => [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155].includes(o.tokenType)))
  public amount: string;
}

export class BlockChainAssetTemplateDto extends BlockChainAssetDto implements IBlockChainAssetTemplateDto {
  protected forbiddenTypes = [TokenType.NATIVE, TokenType.ERC20];

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
  protected forbiddenTypes = [TokenType.NATIVE];

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

export class BlockChainAssetVestingDto extends BlockChainAssetTokenDto implements IBlockChainAssetTokenDto {
  protected forbiddenTypes = [TokenType.NATIVE, TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155];
}
